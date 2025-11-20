import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import './HeroSection.css';

export default function HeroSection() {
  const hostRef = useRef(null);
  const cursorRef = useRef(null);

  useEffect(() => {
    if (!hostRef.current) return;

    const createGhostCursor = (host, opts = {}) => {
      const defaults = {
        trailLength: 50,
        inertia: 0.5,
        grainIntensity: 0.05,
        bloomStrength: 0.1,
        bloomRadius: 1.0,
        bloomThreshold: 0.025,
        brightness: 5,
        color: '#B19EEF',
        mixBlendMode: 'screen',
        edgeIntensity: 0,
        maxDevicePixelRatio: 0.5,
        fadeDelayMs: 1000,
        fadeDurationMs: 1500,
        zIndex: 0
      };

      const cfg = { ...defaults, ...opts };
      const isTouch = (typeof window !== 'undefined') && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
      const pixelBudget = cfg.targetPixels ?? (isTouch ? 0.9e6 : 1.3e6);
      const fadeDelay = cfg.fadeDelayMs ?? (isTouch ? 500 : 1000);
      const fadeDuration = cfg.fadeDurationMs ?? (isTouch ? 1000 : 1500);

      const baseVertexShader = `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `;

      const fragmentShader = `
        uniform float iTime;
        uniform vec3  iResolution;
        uniform vec2  iMouse;
        uniform vec2  iPrevMouse[MAX_TRAIL_LENGTH];
        uniform float iOpacity;
        uniform float iScale;
        uniform vec3  iBaseColor;
        uniform float iBrightness;
        uniform float iEdgeIntensity;
        varying vec2  vUv;

        float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7))) * 43758.5453123); }
        float noise(vec2 p){
          vec2 i = floor(p), f = fract(p);
          f *= f * (3. - 2. * f);
          return mix(mix(hash(i + vec2(0.,0.)), hash(i + vec2(1.,0.)), f.x),
                     mix(hash(i + vec2(0.,1.)), hash(i + vec2(1.,1.)), f.x), f.y);
        }
        float fbm(vec2 p){
          float v = 0.0;
          float a = 0.5;
          mat2 m = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
          for(int i=0;i<5;i++){
            v += a * noise(p);
            p = m * p * 2.0;
            a *= 0.5;
          }
          return v;
        }
        vec3 tint1(vec3 base){ return mix(base, vec3(1.0), 0.15); }
        vec3 tint2(vec3 base){ return mix(base, vec3(0.8, 0.9, 1.0), 0.25); }

        vec4 blob(vec2 p, vec2 mousePos, float intensity, float activity) {
          vec2 q = vec2(fbm(p * iScale + iTime * 0.1), fbm(p * iScale + vec2(5.2,1.3) + iTime * 0.1));
          vec2 r = vec2(fbm(p * iScale + q * 1.5 + iTime * 0.15), fbm(p * iScale + q * 1.5 + vec2(8.3,2.8) + iTime * 0.15));

          float smoke = fbm(p * iScale + r * 0.8);
          float radius = 0.5 + 0.3 * (1.0 / iScale);
          float distFactor = 1.0 - smoothstep(0.0, radius * activity, length(p - mousePos));
          float alpha = pow(smoke, 2.5) * distFactor;

          vec3 c1 = tint1(iBaseColor);
          vec3 c2 = tint2(iBaseColor);
          vec3 color = mix(c1, c2, sin(iTime * 0.5) * 0.5 + 0.5);

          return vec4(color * alpha * intensity, alpha * intensity);
        }

        void main() {
          vec2 uv = (gl_FragCoord.xy / iResolution.xy * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);
          vec2 mouse = (iMouse * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);

          vec3 colorAcc = vec3(0.0);
          float alphaAcc = 0.0;

          vec4 b = blob(uv, mouse, 1.0, iOpacity);
          colorAcc += b.rgb;
          alphaAcc += b.a;

          for (int i = 0; i < MAX_TRAIL_LENGTH; i++) {
            vec2 pm = (iPrevMouse[i] * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);
            float t = 1.0 - float(i) / float(MAX_TRAIL_LENGTH);
            t = pow(t, 2.0);
            if (t > 0.01) {
              vec4 bt = blob(uv, pm, t * 0.8, iOpacity);
              colorAcc += bt.rgb;
              alphaAcc += bt.a;
            }
          }

          colorAcc *= iBrightness;

          vec2 uv01 = gl_FragCoord.xy / iResolution.xy;
          float edgeDist = min(min(uv01.x, 1.0 - uv01.x), min(uv01.y, 1.0 - uv01.y));
          float distFromEdge = clamp(edgeDist * 2.0, 0.0, 1.0);
          float k = clamp(iEdgeIntensity, 0.0, 1.0);
          float edgeMask = mix(1.0 - k, 1.0, distFromEdge);

          float outAlpha = clamp(alphaAcc * iOpacity * edgeMask, 0.0, 1.0);
          gl_FragColor = vec4(colorAcc, outAlpha);
        }
      `;

      const FilmGrainShader = {
        uniforms: {
          tDiffuse: { value: null },
          iTime: { value: 0 },
          intensity: { value: cfg.grainIntensity }
        },
        vertexShader: `
          varying vec2 vUv;
          void main(){
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D tDiffuse;
          uniform float iTime;
          uniform float intensity;
          varying vec2 vUv;

          float hash1(float n){ return fract(sin(n)*43758.5453); }

          void main(){
            vec4 color = texture2D(tDiffuse, vUv);
            float n = hash1(vUv.x*1000.0 + vUv.y*2000.0 + iTime) * 2.0 - 1.0;
            color.rgb += n * intensity * color.rgb;
            gl_FragColor = color;
          }
        `
      };

      const UnpremultiplyPass = new ShaderPass({
        uniforms: { tDiffuse: { value: null } },
        vertexShader: `
          varying vec2 vUv;
          void main(){
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D tDiffuse;
          varying vec2 vUv;
          void main(){
            vec4 c = texture2D(tDiffuse, vUv);
            float a = max(c.a, 1e-5);
            vec3 straight = c.rgb / a;
            gl_FragColor = vec4(clamp(straight, 0.0, 1.0), c.a);
          }
        `
      });

      const renderer = new THREE.WebGLRenderer({
        antialias: !isTouch,
        alpha: true,
        depth: false,
        stencil: false,
        powerPreference: isTouch ? 'low-power' : 'high-performance',
        premultipliedAlpha: false,
        preserveDrawingBuffer: false
      });
      
      renderer.setClearColor(0x000000, 0);
      renderer.domElement.className = 'ghost-canvas';
      renderer.domElement.style.mixBlendMode = cfg.mixBlendMode || '';
      renderer.domElement.style.zIndex = cfg.zIndex;
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const geom = new THREE.PlaneGeometry(2, 2);

      const maxTrail = Math.max(1, Math.floor(cfg.trailLength));
      const trailBuf = Array.from({ length: maxTrail }, () => new THREE.Vector2(0.5, 0.5));
      let head = 0;

      const baseColor = new THREE.Color(cfg.color);
      const material = new THREE.ShaderMaterial({
        defines: { MAX_TRAIL_LENGTH: maxTrail },
        uniforms: {
          iTime: { value: 0 },
          iResolution: { value: new THREE.Vector3(1, 1, 1) },
          iMouse: { value: new THREE.Vector2(0.5, 0.5) },
          iPrevMouse: { value: trailBuf.map(v => v.clone()) },
          iOpacity: { value: 1.0 },
          iScale: { value: 1.0 },
          iBaseColor: { value: new THREE.Vector3(baseColor.r, baseColor.g, baseColor.b) },
          iBrightness: { value: cfg.brightness },
          iEdgeIntensity: { value: cfg.edgeIntensity }
        },
        vertexShader: baseVertexShader,
        fragmentShader: fragmentShader,
        transparent: true,
        depthTest: false,
        depthWrite: false
      });

      const mesh = new THREE.Mesh(geom, material);
      scene.add(mesh);

      const composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      composer.addPass(new UnrealBloomPass(new THREE.Vector2(1, 1), cfg.bloomStrength, cfg.bloomRadius, cfg.bloomThreshold));
      composer.addPass(new ShaderPass(FilmGrainShader));
      composer.addPass(UnpremultiplyPass);

      const currentMouse = new THREE.Vector2(0.5, 0.5);
      const velocity = new THREE.Vector2(0, 0);
      let fadeOpacity = 1.0;
      let lastMoveTime = performance.now();
      let pointerActive = false;
      let running = false;
      let raf = null;

      function calculateScale(el) {
        const r = el.getBoundingClientRect();
        return Math.max(0.5, Math.min(2.0, Math.min(r.width, r.height) / 600));
      }

      function resize() {
        const rect = host.getBoundingClientRect();
        const cssW = Math.max(1, Math.floor(rect.width));
        const cssH = Math.max(1, Math.floor(rect.height));

        const currentDPR = Math.min(window.devicePixelRatio || 1, cfg.maxDevicePixelRatio);
        const need = cssW * cssH * currentDPR * currentDPR;
        const scale = need <= pixelBudget ? 1 : Math.max(0.5, Math.min(1, Math.sqrt(pixelBudget / Math.max(1, need))));
        const pixelRatio = currentDPR * scale;

        renderer.setPixelRatio(pixelRatio);
        renderer.setSize(cssW, cssH, false);

        if (composer.setPixelRatio) composer.setPixelRatio(pixelRatio);
        composer.setSize(cssW, cssH);

        const wpx = Math.max(1, Math.floor(cssW * pixelRatio));
        const hpx = Math.max(1, Math.floor(cssH * pixelRatio));
        material.uniforms.iResolution.value.set(wpx, hpx, 1);
        material.uniforms.iScale.value = calculateScale(host);
      }

      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(host);

      const startTime = performance.now();
      function animate() {
        const now = performance.now();
        const t = (now - startTime) / 1000;

        if (pointerActive) {
          velocity.set(
            currentMouse.x - material.uniforms.iMouse.value.x,
            currentMouse.y - material.uniforms.iMouse.value.y
          );
          material.uniforms.iMouse.value.copy(currentMouse);
          fadeOpacity = 1.0;
        } else {
          velocity.multiplyScalar(cfg.inertia);
          if (velocity.lengthSq() > 1e-6) {
            material.uniforms.iMouse.value.add(velocity);
          }
          const dt = now - lastMoveTime;
          if (dt > fadeDelay) {
            fadeOpacity = Math.max(0, 1 - (dt - fadeDelay) / fadeDuration);
          }
        }

        head = (head + 1) % trailBuf.length;
        trailBuf[head].copy(material.uniforms.iMouse.value);
        const arr = material.uniforms.iPrevMouse.value;
        for (let i = 0; i < trailBuf.length; i++) {
          arr[i].copy(trailBuf[(head - i + trailBuf.length) % trailBuf.length]);
        }

        material.uniforms.iOpacity.value = fadeOpacity;
        material.uniforms.iTime.value = t;
        composer.render();

        if (!pointerActive && fadeOpacity <= 0.001) {
          running = false;
          raf = null;
          return;
        }
        raf = requestAnimationFrame(animate);
      }

      function ensureLoop() {
        if (!running) {
          running = true;
          raf = requestAnimationFrame(animate);
        }
      }

      function onPointerMove(e) {
        const rect = host.getBoundingClientRect();
        const x = THREE.MathUtils.clamp((e.clientX - rect.left) / Math.max(1, rect.width), 0, 1);
        const y = THREE.MathUtils.clamp(1 - (e.clientY - rect.top) / Math.max(1, rect.height), 0, 1);
        currentMouse.set(x, y);
        pointerActive = true;
        lastMoveTime = performance.now();
        ensureLoop();
      }
      function onPointerEnter() { pointerActive = true; ensureLoop(); }
      function onPointerLeave() { pointerActive = false; lastMoveTime = performance.now(); ensureLoop(); }

      host.addEventListener('pointermove', onPointerMove, { passive: true });
      host.addEventListener('pointerenter', onPointerEnter, { passive: true });
      host.addEventListener('pointerleave', onPointerLeave, { passive: true });

      ensureLoop();

      return {
        dispose() {
          if (raf) cancelAnimationFrame(raf);
          host.removeEventListener('pointermove', onPointerMove);
          host.removeEventListener('pointerenter', onPointerEnter);
          host.removeEventListener('pointerleave', onPointerLeave);
          ro.disconnect();
          scene.clear();
          geom.dispose();
          material.dispose();
          composer.dispose();
          renderer.dispose();
          if (renderer.domElement?.parentElement) {
            renderer.domElement.parentElement.removeChild(renderer.domElement);
          }
        }
      };
    };

    cursorRef.current = createGhostCursor(hostRef.current, {
      color: '#B19EEF',
      brightness: 5,
      edgeIntensity: 0,
      trailLength: 50,
      inertia: 0.5,
      grainIntensity: 0.05,
      bloomStrength: 0.1,
      bloomRadius: 1.0,
      bloomThreshold: 0.025,
      fadeDelayMs: 1000,
      fadeDurationMs: 1500,
      mixBlendMode: 'screen'
    });

    return () => {
      if (cursorRef.current) {
        cursorRef.current.dispose();
      }
    };
  }, []);

  return (
    <section className="hero-section" ref={hostRef}>
      <div className="hero-content">
        <img 
          src="/csmanicz.png" 
          alt="CS Manicz Logo" 
          className="hero-logo"
        />
        <h1 className="hero-title">AAGAMAN</h1>
      </div>
    </section>
  );
}
