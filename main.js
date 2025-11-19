// main.js — 3D timeline demo using Three.js
// main.js — 3D timeline demo using Three.js (ES module)
// Import from bare 'three' (resolved by import map in index.html) and OrbitControls via full URL.
import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.152.2/examples/jsm/controls/OrbitControls.js';

(function () {
  const container = document.getElementById('container');
  const tooltip = document.getElementById('tooltip');

  function showFatalError(message, err) {
    console.error(message, err);
    try {
      const existing = document.getElementById('error-overlay');
      if (existing) existing.remove();
      const overlay = document.createElement('div');
      overlay.id = 'error-overlay';
      overlay.style.position = 'fixed';
      overlay.style.left = '12px';
      overlay.style.right = '12px';
      overlay.style.top = '12px';
      overlay.style.padding = '14px';
      overlay.style.background = 'rgba(255,235,235,0.98)';
      overlay.style.color = '#400';
      overlay.style.border = '1px solid #f2c2c2';
      overlay.style.zIndex = 999999;
      overlay.style.fontFamily = 'system-ui, Arial';
      overlay.innerHTML = `<strong>Timeline initialization error</strong><div style="margin-top:6px;">${String(message)}</div>` + (err ? `<pre style="margin-top:8px;color:#800;max-height:240px;overflow:auto">${String(err)}</pre>` : '');
      document.body.appendChild(overlay);
    } catch (e) {
      // ignore overlay failures
    }
  }

  // no global dependency checks needed for module import
  try {

  // sample events — replace or extend these
  const events = [
    { time: '09:00', title: 'Opening Ceremony', desc: 'Welcome remarks and intro.' },
    { time: '09:30', title: 'Keynote', desc: 'Keynote address by guest speaker.' },
    { time: '10:30', title: 'Workshop A', desc: 'Hands-on session: Building with Three.js.' },
    { time: '11:45', title: 'Break', desc: 'Refreshments and networking.' },
    { time: '12:15', title: 'Panel', desc: 'Panel discussion with industry experts.' },
    { time: '13:30', title: 'Lunch', desc: 'Lunch and informal meetups.' },
    { time: '15:00', title: 'Workshop B', desc: 'Interactive workshop: Web performance.' },
    { time: '16:30', title: 'Closing', desc: 'Wrap-up and final notes.' }
  ];

  // THREE.js setup with enhanced visuals
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a1628, 0.015);
  scene.background = new THREE.Color(0x020509);

  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.set(0, 70, 200);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // clock for entrance animations
  const clock = new THREE.Clock();

  // orbit controls so user can examine timeline (module import provides OrbitControls directly)
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 10, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 80;
  controls.maxDistance = 400;
  controls.maxPolarAngle = Math.PI * 0.6;

  // Enhanced lighting setup
  const ambient = new THREE.AmbientLight(0x4a5f8a, 0.4);
  scene.add(ambient);
  
  const hemi = new THREE.HemisphereLight(0x89b3ff, 0x2a3555, 0.6);
  scene.add(hemi);
  
  const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
  mainLight.position.set(100, 120, 50);
  mainLight.castShadow = false;
  scene.add(mainLight);
  
  const fillLight = new THREE.DirectionalLight(0x667eea, 0.4);
  fillLight.position.set(-50, 40, -30);
  scene.add(fillLight);
  
  // Accent point lights for drama
  const accentLight1 = new THREE.PointLight(0x66dbff, 0.8, 150);
  accentLight1.position.set(-100, 30, 0);
  scene.add(accentLight1);
  
  const accentLight2 = new THREE.PointLight(0xaa88ff, 0.8, 150);
  accentLight2.position.set(100, 30, 0);
  scene.add(accentLight2);

  // Enhanced timeline base line with gradient effect
  const timelineLength = 300;
  
  // Main timeline line
  const lineMaterial = new THREE.LineBasicMaterial({ 
    color: 0x4a9eff, 
    linewidth: 3, 
    opacity: 0.8,
    transparent: true 
  });
  const lineGeom = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-timelineLength/2, 0, 0), 
    new THREE.Vector3(timelineLength/2, 0, 0)
  ]);
  const line = new THREE.Line(lineGeom, lineMaterial);
  scene.add(line);
  
  // Add glow line underneath
  const glowLineMaterial = new THREE.LineBasicMaterial({ 
    color: 0x66dbff, 
    linewidth: 8, 
    opacity: 0.3,
    transparent: true 
  });
  const glowLine = new THREE.Line(lineGeom.clone(), glowLineMaterial);
  glowLine.position.y = -0.5;
  scene.add(glowLine);
  
  // Add subtle grid floor for depth
  const gridHelper = new THREE.GridHelper(400, 40, 0x1a3a5f, 0x0f2540);
  gridHelper.position.y = -20;
  gridHelper.material.opacity = 0.15;
  gridHelper.material.transparent = true;
  scene.add(gridHelper);

  // event group
  const eventsGroup = new THREE.Group();
  scene.add(eventsGroup);

  // animated items (for pop-in entrance)
  const animatedItems = [];

  const spacing = timelineLength / (events.length - 1);

  // Enhanced label texture with better styling
  function makeLabelTexture(text, sub) {
    const padding = 14;
    const font = '700 20px Inter, system-ui, Arial';
    const smallFont = '500 14px Inter, system-ui, Arial';
    // approximate width
    const measureCanvas = document.createElement('canvas');
    const mctx = measureCanvas.getContext('2d');
    mctx.font = font;
    const w = Math.max(140, Math.min(420, Math.ceil(mctx.measureText(text).width) + padding * 2 + 10));
    measureCanvas.width = w;
    measureCanvas.height = 70;
    const ctx = measureCanvas.getContext('2d');
    // background with gradient
    ctx.clearRect(0, 0, measureCanvas.width, measureCanvas.height);
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, measureCanvas.height);
    gradient.addColorStop(0, 'rgba(30, 40, 60, 0.95)');
    gradient.addColorStop(1, 'rgba(20, 30, 50, 0.85)');
    
    // Draw rounded background with border
    const r = 10;
    ctx.fillStyle = gradient;
    ctx.strokeStyle = 'rgba(102, 219, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(measureCanvas.width - r, 0);
    ctx.quadraticCurveTo(measureCanvas.width, 0, measureCanvas.width, r);
    ctx.lineTo(measureCanvas.width, measureCanvas.height - r);
    ctx.quadraticCurveTo(measureCanvas.width, measureCanvas.height, measureCanvas.width - r, measureCanvas.height);
    ctx.lineTo(r, measureCanvas.height);
    ctx.quadraticCurveTo(0, measureCanvas.height, 0, measureCanvas.height - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.fill();
    ctx.stroke();

    // Add subtle inner glow
    ctx.shadowColor = 'rgba(102, 219, 255, 0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Title with gradient text effect
    const textGradient = ctx.createLinearGradient(0, 0, 0, 30);
    textGradient.addColorStop(0, '#ffffff');
    textGradient.addColorStop(1, '#c5d9ff');
    ctx.fillStyle = textGradient;
    ctx.font = font;
    ctx.textBaseline = 'top';
    ctx.fillText(text, padding, 10);
    
    // Time badge with background
    ctx.shadowBlur = 0;
    const timeGradient = ctx.createLinearGradient(0, 35, 0, 55);
    timeGradient.addColorStop(0, 'rgba(102, 126, 234, 0.9)');
    timeGradient.addColorStop(1, 'rgba(118, 75, 162, 0.9)');
    ctx.fillStyle = timeGradient;
    ctx.beginPath();
    ctx.roundRect(padding, 38, ctx.measureText(sub).width + 12, 22, 6);
    ctx.fill();
    
    // Time text
    ctx.fillStyle = '#ffffff';
    ctx.font = smallFont;
    ctx.fillText(sub, padding + 6, 42);

    const tex = new THREE.CanvasTexture(measureCanvas);
    tex.minFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    return tex;
  }

  // Create enhanced event spheres with visual effects
  const sphereGeo = new THREE.SphereGeometry(4.5, 32, 24);
  const baseColors = [
    new THREE.Color(0x667eea), // purple-blue
    new THREE.Color(0x66dbff), // cyan
    new THREE.Color(0x764ba2), // purple
    new THREE.Color(0x4a9eff), // blue
    new THREE.Color(0x89b3ff), // light blue
    new THREE.Color(0xaa88ff), // lavender
    new THREE.Color(0x5588ff), // medium blue
    new THREE.Color(0x7799ff)  // sky blue
  ];

  events.forEach((evt, i) => {
    const x = -timelineLength/2 + i * spacing;
    
    // Enhanced sphere with better materials
    const colorIndex = i % baseColors.length;
    const mat = new THREE.MeshStandardMaterial({ 
      color: baseColors[colorIndex],
      metalness: 0.3, 
      roughness: 0.3,
      emissive: baseColors[colorIndex],
      emissiveIntensity: 0.2
    });
    const sphere = new THREE.Mesh(sphereGeo, mat);
    sphere.position.set(x, 0, 0);
    sphere.userData = { evt, index: i, baseColor: baseColors[colorIndex].clone() };
    // start all event spheres scaled down for entrance animation
    sphere.scale.set(0.001, 0.001, 0.001);
    // small delay so they pop sequentially
    sphere.userData._delay = i * 0.12;
    sphere.userData._pulseOffset = i * 0.5;
    animatedItems.push(sphere);
    eventsGroup.add(sphere);

    // Enhanced glow ring with animated pulse
    const ringGeo = new THREE.RingGeometry(5.5, 6.5, 32);
    const ringMat = new THREE.MeshBasicMaterial({ 
      color: baseColors[colorIndex], 
      side: THREE.DoubleSide, 
      opacity: 0.5, 
      transparent: true 
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI/2;
    ring.position.set(x, -0.1, 0);
    ring.userData._pulseOffset = i * 0.5;
    eventsGroup.add(ring);
    animatedItems.push(ring);
    
    // Add outer glow ring
    const outerRingGeo = new THREE.RingGeometry(7, 8, 32);
    const outerRingMat = new THREE.MeshBasicMaterial({ 
      color: baseColors[colorIndex], 
      side: THREE.DoubleSide, 
      opacity: 0.2, 
      transparent: true 
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.rotation.x = Math.PI/2;
    outerRing.position.set(x, -0.15, 0);
    outerRing.userData._pulseOffset = i * 0.5 + 0.3;
    eventsGroup.add(outerRing);
    animatedItems.push(outerRing);
    
    // Add connecting vertical line from sphere to timeline
    const connectorGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.5, 8);
    const connectorMat = new THREE.MeshStandardMaterial({ 
      color: baseColors[colorIndex],
      metalness: 0.5,
      roughness: 0.3,
      emissive: baseColors[colorIndex],
      emissiveIntensity: 0.3
    });
    const connector = new THREE.Mesh(connectorGeo, connectorMat);
    connector.position.set(x, -0.25, 0);
    connector.scale.set(0.001, 0.001, 0.001);
    connector.userData._delay = i * 0.12 + 0.1;
    animatedItems.push(connector);
    eventsGroup.add(connector);

    // Enhanced label sprite with fade-in
    const tex = makeLabelTexture(evt.title, evt.time);
    const spriteMat = new THREE.SpriteMaterial({ 
      map: tex, 
      depthTest: false, 
      depthWrite: false,
      transparent: true,
      opacity: 0
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(tex.image.width * 0.14, tex.image.height * 0.14, 1);
    sprite.position.set(x, 15, 0);
    sprite.userData = { evt, _delay: i * 0.12 + 0.3, _isLabel: true };
    eventsGroup.add(sprite);
    animatedItems.push(sprite);
  });

  // keyboard navigation: focus previous/next event with arrow keys
  let focusedIndex = -1;
  function focusEvent(index) {
    index = Math.max(0, Math.min(events.length - 1, index));
    focusedIndex = index;
    const sphere = eventsGroup.children.find(c => c.userData && c.userData.index === index && c.geometry && c.geometry.type === 'SphereGeometry');
    if (!sphere) return;
    focusTarget = sphere.position.clone().add(new THREE.Vector3(0, 8, 30));
    focusStart = controls.target.clone();
    focusStartCam = camera.position.clone();
    focusT = 0;
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      focusEvent((focusedIndex === -1 ? 0 : focusedIndex + 1));
    } else if (e.key === 'ArrowLeft') {
      focusEvent((focusedIndex === -1 ? events.length - 1 : focusedIndex - 1));
    }
  });

  // Mobile navigation buttons
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      focusEvent((focusedIndex === -1 ? events.length - 1 : focusedIndex - 1));
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      focusEvent((focusedIndex === -1 ? 0 : focusedIndex + 1));
    });
  }

  // raycaster for hover / click
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let hovered = null;
  let focusTarget = null;
  let focusStart = null;
  let focusStartCam = null;
  let focusT = 0;

  function onPointerMove(e) {
    const rect = renderer.domElement.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    mouse.set(x, y);

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(eventsGroup.children.filter(c => c.type === 'Mesh' && c.geometry.type === 'SphereGeometry'));
    if (intersects.length) {
      const hit = intersects[0].object;
      if (hovered !== hit) {
        if (hovered) {
          hovered.scale.set(1,1,1);
          // Reset material
          if (hovered.material.emissive) {
            hovered.material.emissive.copy(hovered.userData.baseColor);
            hovered.material.emissiveIntensity = 0.2;
          }
        }
        hovered = hit;
        hovered.scale.set(1.4,1.4,1.4);
        // Brighten on hover
        if (hovered.material.emissive) {
          hovered.material.emissiveIntensity = 0.6;
        }
        renderer.domElement.style.cursor = 'pointer';
      }
      // tooltip position and content
      const p = intersects[0].point.clone();
      const screen = toScreenPosition(p, camera, renderer);
      tooltip.style.left = screen.x + 'px';
      tooltip.style.top = screen.y + 'px';
      tooltip.innerHTML = `<strong>${hit.userData.evt.title}</strong><small>${hit.userData.evt.time}</small><div style="margin-top:8px;font-size:13px;color:#334;line-height:1.5">${hit.userData.evt.desc}</div>`;
      tooltip.classList.remove('hidden');
    } else {
      if (hovered) {
        hovered.scale.set(1,1,1);
        if (hovered.material.emissive) {
          hovered.material.emissive.copy(hovered.userData.baseColor);
          hovered.material.emissiveIntensity = 0.2;
        }
      }
      hovered = null;
      tooltip.classList.add('hidden');
      renderer.domElement.style.cursor = 'default';
    }
  }

  function onClick(e) {
    // click to show modal popup with event details
    const rect = renderer.domElement.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    mouse.set(x, y);
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(eventsGroup.children.filter(c => c.type === 'Mesh' && c.geometry.type === 'SphereGeometry'));
    if (intersects.length) {
      const hit = intersects[0].object;
      const evt = hit.userData.evt;
      
      // Show modal popup
      showEventModal(evt);
      
      // Also focus camera on the event
      focusTarget = hit.position.clone().add(new THREE.Vector3(0, 8, 30));
      focusStart = controls.target.clone();
      focusStartCam = camera.position.clone();
      focusT = 0;
    }
  }

  // Modal popup functions
  function showEventModal(evt) {
    const modal = document.getElementById('eventModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalTime = document.getElementById('modalTime');
    const modalDesc = document.getElementById('modalDesc');
    
    modalTitle.textContent = evt.title;
    modalTime.textContent = evt.time;
    modalDesc.textContent = evt.desc;
    
    modal.classList.remove('hidden');
    
    // Hide tooltip when modal opens
    tooltip.classList.add('hidden');
  }

  function hideEventModal() {
    const modal = document.getElementById('eventModal');
    modal.classList.add('hidden');
  }

  // Modal event listeners
  const modalCloseBtn = document.querySelector('.modal-close');
  const modalOverlay = document.querySelector('.modal-overlay');
  
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', hideEventModal);
  }
  
  if (modalOverlay) {
    modalOverlay.addEventListener('click', hideEventModal);
  }
  
  // Close modal with Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideEventModal();
    }
  });

  function toScreenPosition(vec3, cam, rend) {
    const pos = vec3.clone();
    pos.project(cam);
    const x = (pos.x * 0.5 + 0.5) * rend.domElement.clientWidth;
    const y = ( - pos.y * 0.5 + 0.5) * rend.domElement.clientHeight;
    return { x: Math.round(x), y: Math.round(y) };
  }

  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('click', onClick);

  function animate() {
    requestAnimationFrame(animate);
    controls.update();

    const elapsed = clock.getElapsedTime();
    
    // Enhanced entrance animations with different effects for different objects
    for (let i = 0; i < animatedItems.length; i++) {
      const obj = animatedItems[i];
      const d = obj.userData._delay || 0;
      const animDur = 0.8;
      const t = Math.max(0, Math.min(1, (elapsed - d) / animDur));
      const eased = 1 - Math.pow(1 - t, 3);
      
      // Different animation for labels (fade in) vs spheres (scale in)
      if (obj.userData._isLabel) {
        obj.material.opacity = eased;
        const bounceScale = 1 + Math.sin(t * Math.PI) * 0.1;
        obj.scale.setScalar(obj.scale.x > 0 ? bounceScale * 15 : 15);
      } else if (obj.geometry && obj.geometry.type === 'RingGeometry') {
        // Rings pulse continuously
        const pulse = Math.sin(elapsed * 2 + (obj.userData._pulseOffset || 0)) * 0.15 + 1;
        const baseScale = 0.001 + eased * (1 - 0.001);
        obj.scale.setScalar(baseScale * pulse);
        obj.material.opacity = (0.3 + Math.sin(elapsed * 2 + (obj.userData._pulseOffset || 0)) * 0.1) * eased;
      } else {
        const scale = 0.001 + eased * (1 - 0.001);
        obj.scale.setScalar(scale);
      }
    }
    
    // Animate spheres with subtle floating and pulsing glow
    eventsGroup.children.forEach(child => {
      if (child.geometry && child.geometry.type === 'SphereGeometry') {
        const offset = child.userData._pulseOffset || 0;
        const floatY = Math.sin(elapsed * 0.8 + offset) * 0.5;
        child.position.y = floatY;
        
        // Pulse emissive intensity
        if (child.material.emissive) {
          child.material.emissiveIntensity = 0.2 + Math.sin(elapsed * 1.5 + offset) * 0.15;
        }
      }
    });

    // animate focus camera if requested
    if (focusTarget) {
      focusT += 0.02;
      const t = Math.min(1, easeOutCubic(focusT));
      // lerp controls.target
      controls.target.lerpVectors(focusStart, focusTarget, t);
      // move camera closer in a subtle way
      camera.position.lerpVectors(focusStartCam, focusTarget.clone().add(new THREE.Vector3(0, 18, 60)), t);
      if (t >= 1) {
        focusTarget = null; // done
      }
    }

    renderer.render(scene, camera);
  }

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  window.addEventListener('resize', onResize);
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

    animate();
  } catch (err) {
    showFatalError('Unhandled error during initialization', err);
  }

})();
