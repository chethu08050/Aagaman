import { useEffect, useMemo, useRef, useCallback, useState } from 'react';
import { useGesture } from '@use-gesture/react';
import './DomeGallery.css';

const getAssetUrl = (path) => `${process.env.PUBLIC_URL || ''}${path}`;

const DEFAULT_IMAGES = [
  // Photos
  { src: getAssetUrl('/media/WhatsApp Image 2025-11-19 at 12.56.03_342139af.jpg'), alt: 'Fresher Party Photo 1' },
  { src: getAssetUrl('/media/WhatsApp Image 2025-11-19 at 12.56.19_06c769e7.jpg'), alt: 'Fresher Party Photo 2' },
  { src: getAssetUrl('/media/WhatsApp Image 2025-11-20 at 09.40.47_18613c6a.jpg'), alt: 'Fresher Party Photo 3' },
  { src: getAssetUrl('/media/WhatsApp Image 2025-11-20 at 09.40.47_4ee9b173.jpg'), alt: 'Fresher Party Photo 4' },
  { src: getAssetUrl('/media/WhatsApp Image 2025-11-20 at 09.42.33_90291a03.jpg'), alt: 'Fresher Party Photo 5' },
  { src: getAssetUrl('/media/WhatsApp Image 2025-11-20 at 09.42.34_37b0e162.jpg'), alt: 'Fresher Party Photo 6' },
  { src: getAssetUrl('/media/WhatsApp Image 2025-11-20 at 09.42.34_3a82c0fd.jpg'), alt: 'Fresher Party Photo 7' },
  { src: getAssetUrl('/media/WhatsApp Image 2025-11-20 at 09.42.34_6059ecd5.jpg'), alt: 'Fresher Party Photo 8' },
  { src: getAssetUrl('/media/WhatsApp Image 2025-11-20 at 09.42.53_d38dc65d.jpg'), alt: 'Fresher Party Photo 9' },
  { src: getAssetUrl('/media/WhatsApp Image 2025-11-20 at 09.42.53_f1b4872c.jpg'), alt: 'Fresher Party Photo 10' },
  { src: getAssetUrl('/media/WhatsApp Image 2025-11-20 at 09.43.17_c22d4e91.jpg'), alt: 'Fresher Party Photo 11' },
  
  // Videos
  { src: getAssetUrl('/media/WhatsApp Video 2025-11-19 at 12.56.04_1ec871db.mp4'), alt: 'Fresher Party Video 1' },
  { src: getAssetUrl('/media/WhatsApp Video 2025-11-19 at 12.56.04_689a7829.mp4'), alt: 'Fresher Party Video 2' },
  { src: getAssetUrl('/media/WhatsApp Video 2025-11-19 at 12.56.05_31696360.mp4'), alt: 'Fresher Party Video 3' },
  { src: getAssetUrl('/media/WhatsApp Video 2025-11-19 at 12.56.06_0ac574de.mp4'), alt: 'Fresher Party Video 4' },
  { src: getAssetUrl('/media/WhatsApp Video 2025-11-19 at 12.56.11_3f7c22b7.mp4'), alt: 'Fresher Party Video 5' },
  { src: getAssetUrl('/media/WhatsApp Video 2025-11-19 at 12.56.23_fe9d421f.mp4'), alt: 'Fresher Party Video 6' },
  { src: getAssetUrl('/media/WhatsApp Video 2025-11-19 at 12.56.25_3a64f5d7.mp4'), alt: 'Fresher Party Video 7' },
  { src: getAssetUrl('/media/WhatsApp Video 2025-11-19 at 12.57.03_1686b5df.mp4'), alt: 'Fresher Party Video 8' },
  { src: getAssetUrl('/media/WhatsApp Video 2025-11-19 at 12.57.03_1c76519c.mp4'), alt: 'Fresher Party Video 9' },
  { src: getAssetUrl('/media/WhatsApp Video 2025-11-19 at 12.57.03_6b07a0a1.mp4'), alt: 'Fresher Party Video 10' },
  { src: getAssetUrl('/media/WhatsApp Video 2025-11-19 at 12.57.04_0d483b8d.mp4'), alt: 'Fresher Party Video 11' },
  { src: getAssetUrl('/media/WhatsApp Video 2025-11-19 at 12.57.06_6b573080.mp4'), alt: 'Fresher Party Video 12' },
  { src: getAssetUrl('/media/WhatsApp Video 2025-11-19 at 12.57.07_47eb0d28.mp4'), alt: 'Fresher Party Video 13' },
  { src: getAssetUrl('/media/WhatsApp Video 2025-11-19 at 12.57.07_bc94785c.mp4'), alt: 'Fresher Party Video 14' },
  { src: getAssetUrl('/media/WhatsApp Video 2025-11-19 at 12.57.08_c0cf40c9.mp4'), alt: 'Fresher Party Video 15' },
  { src: getAssetUrl('/media/WhatsApp Video 2025-11-19 at 12.57.08_d9a1c257.mp4'), alt: 'Fresher Party Video 16' },
  { src: getAssetUrl('/media/WhatsApp Video 2025-11-19 at 12.57.10_16c55ec2.mp4'), alt: 'Fresher Party Video 17' },
  { src: getAssetUrl('/media/WhatsApp Video 2025-11-19 at 12.57.10_d983d46c.mp4'), alt: 'Fresher Party Video 18' },
  { src: getAssetUrl('/media/WhatsApp Video 2025-11-20 at 09.41.50_e7d69fb5.mp4'), alt: 'Fresher Party Video 19' },
  { src: getAssetUrl('/media/WhatsApp Video 2025-11-20 at 09.41.51_3ff28cd1.mp4'), alt: 'Fresher Party Video 20' },
  { src: getAssetUrl('/media/WhatsApp Video 2025-11-20 at 09.41.51_d0677dd7.mp4'), alt: 'Fresher Party Video 21' },
  { src: getAssetUrl('/media/WhatsApp Video 2025-11-20 at 09.41.52_881d5659.mp4'), alt: 'Fresher Party Video 22' }
];

const DEFAULTS = {
  maxVerticalRotationDeg: 5,
  dragSensitivity: 15,
  enlargeTransitionMs: 200,
  segments: 20
};

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const normalizeAngle = d => ((d % 360) + 360) % 360;
const wrapAngleSigned = deg => {
  const a = (((deg + 180) % 360) + 360) % 360;
  return a - 180;
};
const getDataNumber = (el, name, fallback) => {
  const attr = el.dataset[name] ?? el.getAttribute(`data-${name}`);
  const n = attr == null ? NaN : parseFloat(attr);
  return Number.isFinite(n) ? n : fallback;
};

function buildItems(pool, seg) {
  const xCols = Array.from({ length: seg }, (_, i) => -37 + i * 2);
  const evenYs = [-4, -2, 0, 2, 4];
  const oddYs = [-3, -1, 1, 3, 5];

  const coords = xCols.flatMap((x, c) => {
    const ys = c % 2 === 0 ? evenYs : oddYs;
    return ys.map(y => ({ x, y, sizeX: 2, sizeY: 2 }));
  });

  const totalSlots = coords.length;
  if (pool.length === 0) {
    return coords.map(c => ({ ...c, src: '', alt: '' }));
  }
  if (pool.length > totalSlots) {
    console.warn(
      `[DomeGallery] Provided image count (${pool.length}) exceeds available tiles (${totalSlots}). Some images will not be shown.`
    );
  }

  const normalizedImages = pool.map(image => {
    if (typeof image === 'string') {
      return { src: image, alt: '' };
    }
    return { src: image.src || '', alt: image.alt || '' };
  });

  const usedImages = Array.from({ length: totalSlots }, (_, i) => normalizedImages[i % normalizedImages.length]);

  for (let i = 1; i < usedImages.length; i++) {
    if (usedImages[i].src === usedImages[i - 1].src) {
      for (let j = i + 1; j < usedImages.length; j++) {
        if (usedImages[j].src !== usedImages[i].src) {
          const tmp = usedImages[i];
          usedImages[i] = usedImages[j];
          usedImages[j] = tmp;
          break;
        }
      }
    }
  }

  return coords.map((c, i) => ({
    ...c,
    src: usedImages[i].src,
    alt: usedImages[i].alt
  }));
}

function computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, segments) {
  const unit = 360 / segments / 2;
  const rotateY = unit * (offsetX + (sizeX - 1) / 2);
  const rotateX = unit * (offsetY - (sizeY - 1) / 2);
  return { rotateX, rotateY };
}

export default function DomeGallery({
  images = DEFAULT_IMAGES,
  fit = 0.5,
  fitBasis = 'auto',
  minRadius = 600,
  maxRadius = Infinity,
  padFactor = 0.25,
  overlayBlurColor = '#060010',
  maxVerticalRotationDeg = DEFAULTS.maxVerticalRotationDeg,
  dragSensitivity = DEFAULTS.dragSensitivity,
  enlargeTransitionMs = DEFAULTS.enlargeTransitionMs,
  segments = DEFAULTS.segments,
  dragDampening = 2,
  openedImageWidth = '250px',
  openedImageHeight = '350px',
  imageBorderRadius = '30px',
  openedImageBorderRadius = '30px',
  grayscale = true
}) {
  const rootRef = useRef(null);
  const mainRef = useRef(null);
  const sphereRef = useRef(null);
  const frameRef = useRef(null);
  const viewerRef = useRef(null);
  const scrimRef = useRef(null);
  const focusedElRef = useRef(null);
  const originalTilePositionRef = useRef(null);

  const rotationRef = useRef({ x: 0, y: 0 });
  const startRotRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef(null);
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const inertiaRAF = useRef(null);
  const openingRef = useRef(false);
  const openStartedAtRef = useRef(0);
  const lastDragEndAt = useRef(0);
  
  // New feature refs
  const particlesRef = useRef([]);
  const spotlightRef = useRef({ x: 0, y: 0 });
  const autoRotateRAF = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const currentColorRef = useRef('#8a2be2');
  const isHoveringTileRef = useRef(false);
  const autoRotateSpeedRef = useRef(0); // For smooth acceleration/deceleration
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Preload images
  useEffect(() => {
    const imageUrls = items
      .filter(item => item.src && !item.src.endsWith('.mp4') && !item.src.endsWith('.webm'))
      .map(item => item.src);
    
    let loadedCount = 0;
    const totalImages = imageUrls.length;
    
    if (totalImages === 0) {
      setImagesLoaded(true);
      return;
    }

    const preloadImage = (src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            setImagesLoaded(true);
          }
          resolve();
        };
        img.onerror = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            setImagesLoaded(true);
          }
          resolve();
        };
        img.src = src;
      });
    };

    // Preload first 10 images immediately, rest progressively
    const priorityImages = imageUrls.slice(0, 10);
    const remainingImages = imageUrls.slice(10);

    Promise.all(priorityImages.map(preloadImage)).then(() => {
      // Load remaining images in background
      remainingImages.forEach(src => preloadImage(src));
    });
  }, [items]);

  const scrollLockedRef = useRef(false);
  const lockScroll = useCallback(() => {
    if (scrollLockedRef.current) return;
    scrollLockedRef.current = true;
    document.body.classList.add('dg-scroll-lock');
  }, []);
  const unlockScroll = useCallback(() => {
    if (!scrollLockedRef.current) return;
    if (rootRef.current?.getAttribute('data-enlarging') === 'true') return;
    scrollLockedRef.current = false;
    document.body.classList.remove('dg-scroll-lock');
  }, []);

  const items = useMemo(() => buildItems(images, segments), [images, segments]);

  const applyTransform = (xDeg, yDeg) => {
    const el = sphereRef.current;
    if (el) {
      // Use CSS custom properties for smoother transform updates
      const transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg.toFixed(3)}deg) rotateY(${yDeg.toFixed(3)}deg)`;
      el.style.transform = transform;
      el.style.webkitTransform = transform; // Safari/iOS optimization
    }
  };

  const lockedRadiusRef = useRef(null);
  const rafIdRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver(entries => {
      const cr = entries[0].contentRect;
      const w = Math.max(1, cr.width),
        h = Math.max(1, cr.height);
      const minDim = Math.min(w, h),
        maxDim = Math.max(w, h),
        aspect = w / h;
      let basis;
      switch (fitBasis) {
        case 'min':
          basis = minDim;
          break;
        case 'max':
          basis = maxDim;
          break;
        case 'width':
          basis = w;
          break;
        case 'height':
          basis = h;
          break;
        default:
          basis = aspect >= 1.3 ? w : minDim;
      }
      let radius = basis * fit;
      const heightGuard = h * 1.35;
      radius = Math.min(radius, heightGuard);
      radius = clamp(radius, minRadius, maxRadius);
      lockedRadiusRef.current = Math.round(radius);

      const viewerPad = Math.max(8, Math.round(minDim * padFactor));
      root.style.setProperty('--radius', `${lockedRadiusRef.current}px`);
      root.style.setProperty('--viewer-pad', `${viewerPad}px`);
      root.style.setProperty('--overlay-blur-color', overlayBlurColor);
      root.style.setProperty('--tile-radius', imageBorderRadius);
      root.style.setProperty('--enlarge-radius', openedImageBorderRadius);
      root.style.setProperty('--image-filter', grayscale ? 'grayscale(1)' : 'none');
      applyTransform(rotationRef.current.x, rotationRef.current.y);

      const enlargedOverlay = viewerRef.current?.querySelector('.enlarge');
      if (enlargedOverlay && frameRef.current && mainRef.current) {
        const frameR = frameRef.current.getBoundingClientRect();
        const mainR = mainRef.current.getBoundingClientRect();

        const hasCustomSize = openedImageWidth && openedImageHeight;
        if (hasCustomSize) {
          const tempDiv = document.createElement('div');
          tempDiv.style.cssText = `position: absolute; width: ${openedImageWidth}; height: ${openedImageHeight}; visibility: hidden;`;
          document.body.appendChild(tempDiv);
          const tempRect = tempDiv.getBoundingClientRect();
          document.body.removeChild(tempDiv);

          const centeredLeft = frameR.left - mainR.left + (frameR.width - tempRect.width) / 2;
          const centeredTop = frameR.top - mainR.top + (frameR.height - tempRect.height) / 2;

          enlargedOverlay.style.left = `${centeredLeft}px`;
          enlargedOverlay.style.top = `${centeredTop}px`;
        } else {
          enlargedOverlay.style.left = `${frameR.left - mainR.left}px`;
          enlargedOverlay.style.top = `${frameR.top - mainR.top}px`;
          enlargedOverlay.style.width = `${frameR.width}px`;
          enlargedOverlay.style.height = `${frameR.height}px`;
        }
      }
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, [
    fit,
    fitBasis,
    minRadius,
    maxRadius,
    padFactor,
    overlayBlurColor,
    grayscale,
    imageBorderRadius,
    openedImageBorderRadius,
    openedImageWidth,
    openedImageHeight
  ]);

  useEffect(() => {
    applyTransform(rotationRef.current.x, rotationRef.current.y);
  }, []);

  const stopInertia = useCallback(() => {
    if (inertiaRAF.current) {
      cancelAnimationFrame(inertiaRAF.current);
      inertiaRAF.current = null;
    }
  }, []);

  const startInertia = useCallback(
    (vx, vy) => {
      const MAX_V = 1.4;
      let vX = clamp(vx, -MAX_V, MAX_V) * 80;
      let vY = clamp(vy, -MAX_V, MAX_V) * 80;
      let frames = 0;
      const d = clamp(dragDampening ?? 0.6, 0, 1);
      const frictionMul = 0.95 + 0.04 * d;
      const stopThreshold = 0.02 - 0.01 * d;
      const maxFrames = Math.round(80 + 220 * d);
      const step = () => {
        vX *= frictionMul;
        vY *= frictionMul;
        if (Math.abs(vX) < stopThreshold && Math.abs(vY) < stopThreshold) {
          inertiaRAF.current = null;
          return;
        }
        if (++frames > maxFrames) {
          inertiaRAF.current = null;
          return;
        }
        const nextX = clamp(rotationRef.current.x - vY / 200, -maxVerticalRotationDeg, maxVerticalRotationDeg);
        const nextY = wrapAngleSigned(rotationRef.current.y + vX / 200);
        rotationRef.current = { x: nextX, y: nextY };
        applyTransform(nextX, nextY);
        inertiaRAF.current = requestAnimationFrame(step);
      };
      stopInertia();
      inertiaRAF.current = requestAnimationFrame(step);
    },
    [dragDampening, maxVerticalRotationDeg, stopInertia]
  );

  useGesture(
    {
      onDragStart: ({ event }) => {
        if (focusedElRef.current) return;
        stopInertia();
        const evt = event;
        draggingRef.current = true;
        movedRef.current = false;
        startRotRef.current = { ...rotationRef.current };
        startPosRef.current = { x: evt.clientX, y: evt.clientY };
        
        // Cancel any pending RAF and remove CSS transitions for immediate response
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
        if (sphereRef.current) {
          sphereRef.current.style.transition = 'none';
        }
      },
      onDrag: ({ event, last, velocity = [0, 0], direction = [0, 0], movement }) => {
        if (focusedElRef.current || !draggingRef.current || !startPosRef.current) return;
        
        // Throttle updates for smoother performance - update immediately without RAF during drag
        const evt = event;
        const dxTotal = evt.clientX - startPosRef.current.x;
        const dyTotal = evt.clientY - startPosRef.current.y;
        
        if (!movedRef.current) {
          const dist2 = dxTotal * dxTotal + dyTotal * dyTotal;
          if (dist2 > 9) movedRef.current = true;
        }
        
        const nextX = clamp(
          startRotRef.current.x - dyTotal / dragSensitivity,
          -maxVerticalRotationDeg,
          maxVerticalRotationDeg
        );
        const nextY = wrapAngleSigned(startRotRef.current.y + dxTotal / dragSensitivity);
        
        if (rotationRef.current.x !== nextX || rotationRef.current.y !== nextY) {
          rotationRef.current = { x: nextX, y: nextY };
          applyTransform(nextX, nextY);
        }
        
        if (last) {
          draggingRef.current = false;
          let [vMagX, vMagY] = velocity;
          const [dirX, dirY] = direction;
          let vx = vMagX * dirX;
          let vy = vMagY * dirY;
          if (Math.abs(vx) < 0.001 && Math.abs(vy) < 0.001 && Array.isArray(movement)) {
            const [mx, my] = movement;
            vx = clamp((mx / dragSensitivity) * 0.02, -1.2, 1.2);
            vy = clamp((my / dragSensitivity) * 0.02, -1.2, 1.2);
          }
          if (Math.abs(vx) > 0.005 || Math.abs(vy) > 0.005) startInertia(vx, vy);
          if (movedRef.current) lastDragEndAt.current = performance.now();
          movedRef.current = false;
        }
      }
    },
    { target: mainRef, eventOptions: { passive: false }, drag: { threshold: 3 } }
  );

  useEffect(() => {
    const scrim = scrimRef.current;
    if (!scrim) return;
    const close = () => {
      if (performance.now() - openStartedAtRef.current < 250) return;
      const el = focusedElRef.current;
      if (!el) return;
      const parent = el.parentElement;
      const overlay = viewerRef.current?.querySelector('.enlarge');
      if (!overlay) return;
      const refDiv = parent.querySelector('.item__image--reference');
      const originalPos = originalTilePositionRef.current;
      if (!originalPos) {
        overlay.remove();
        if (refDiv) refDiv.remove();
        parent.style.setProperty('--rot-y-delta', '0deg');
        parent.style.setProperty('--rot-x-delta', '0deg');
        el.style.visibility = '';
        el.style.zIndex = 0;
        focusedElRef.current = null;
        rootRef.current?.removeAttribute('data-enlarging');
        openingRef.current = false;
        unlockScroll();
        return;
      }
      const currentRect = overlay.getBoundingClientRect();
      const rootRect = rootRef.current.getBoundingClientRect();
      const originalPosRelativeToRoot = {
        left: originalPos.left - rootRect.left,
        top: originalPos.top - rootRect.top,
        width: originalPos.width,
        height: originalPos.height
      };
      const overlayRelativeToRoot = {
        left: currentRect.left - rootRect.left,
        top: currentRect.top - rootRect.top,
        width: currentRect.width,
        height: currentRect.height
      };
      const animatingOverlay = document.createElement('div');
      animatingOverlay.className = 'enlarge-closing';
      animatingOverlay.style.cssText = `position:absolute;left:${overlayRelativeToRoot.left}px;top:${overlayRelativeToRoot.top}px;width:${overlayRelativeToRoot.width}px;height:${overlayRelativeToRoot.height}px;z-index:9999;border-radius: var(--enlarge-radius, 32px);overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.35);transition:all ${enlargeTransitionMs}ms ease-out;pointer-events:none;margin:0;transform:none;`;
      const originalImg = overlay.querySelector('img');
      if (originalImg) {
        const img = originalImg.cloneNode();
        img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
        animatingOverlay.appendChild(img);
      }
      overlay.remove();
      rootRef.current.appendChild(animatingOverlay);
      void animatingOverlay.getBoundingClientRect();
      requestAnimationFrame(() => {
        animatingOverlay.style.left = originalPosRelativeToRoot.left + 'px';
        animatingOverlay.style.top = originalPosRelativeToRoot.top + 'px';
        animatingOverlay.style.width = originalPosRelativeToRoot.width + 'px';
        animatingOverlay.style.height = originalPosRelativeToRoot.height + 'px';
        animatingOverlay.style.opacity = '0';
      });
      const cleanup = () => {
        animatingOverlay.remove();
        originalTilePositionRef.current = null;
        if (refDiv) refDiv.remove();
        parent.style.transition = 'none';
        el.style.transition = 'none';
        parent.style.setProperty('--rot-y-delta', '0deg');
        parent.style.setProperty('--rot-x-delta', '0deg');
        requestAnimationFrame(() => {
          el.style.visibility = '';
          el.style.opacity = '0';
          el.style.zIndex = 0;
          focusedElRef.current = null;
          rootRef.current?.removeAttribute('data-enlarging');
          requestAnimationFrame(() => {
            parent.style.transition = '';
            el.style.transition = 'opacity 300ms ease-out';
            requestAnimationFrame(() => {
              el.style.opacity = '1';
              setTimeout(() => {
                el.style.transition = '';
                el.style.opacity = '';
                openingRef.current = false;
                if (!draggingRef.current && rootRef.current?.getAttribute('data-enlarging') !== 'true')
                  document.body.classList.remove('dg-scroll-lock');
              }, 300);
            });
          });
        });
      };
      animatingOverlay.addEventListener('transitionend', cleanup, { once: true });
    };
    scrim.addEventListener('click', close);
    const onKey = e => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      scrim.removeEventListener('click', close);
      window.removeEventListener('keydown', onKey);
    };
  }, [enlargeTransitionMs, unlockScroll]);

  const openItemFromElement = useCallback(
    el => {
      if (openingRef.current) return;
      openingRef.current = true;
      openStartedAtRef.current = performance.now();
      lockScroll();
      const parent = el.parentElement;
      focusedElRef.current = el;
      el.setAttribute('data-focused', 'true');
      const offsetX = getDataNumber(parent, 'offsetX', 0);
      const offsetY = getDataNumber(parent, 'offsetY', 0);
      const sizeX = getDataNumber(parent, 'sizeX', 2);
      const sizeY = getDataNumber(parent, 'sizeY', 2);
      const parentRot = computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, segments);
      const parentY = normalizeAngle(parentRot.rotateY);
      const globalY = normalizeAngle(rotationRef.current.y);
      let rotY = -(parentY + globalY) % 360;
      if (rotY < -180) rotY += 360;
      const rotX = -parentRot.rotateX - rotationRef.current.x;
      parent.style.setProperty('--rot-y-delta', `${rotY}deg`);
      parent.style.setProperty('--rot-x-delta', `${rotX}deg`);
      const refDiv = document.createElement('div');
      refDiv.className = 'item__image item__image--reference';
      refDiv.style.opacity = '0';
      refDiv.style.transform = `rotateX(${-parentRot.rotateX}deg) rotateY(${-parentRot.rotateY}deg)`;
      parent.appendChild(refDiv);

      void refDiv.offsetHeight;

      const tileR = refDiv.getBoundingClientRect();
      const mainR = mainRef.current?.getBoundingClientRect();
      const frameR = frameRef.current?.getBoundingClientRect();

      if (!mainR || !frameR || tileR.width <= 0 || tileR.height <= 0) {
        openingRef.current = false;
        focusedElRef.current = null;
        parent.removeChild(refDiv);
        unlockScroll();
        return;
      }

      originalTilePositionRef.current = { left: tileR.left, top: tileR.top, width: tileR.width, height: tileR.height };
      el.style.visibility = 'hidden';
      el.style.zIndex = 0;
      const overlay = document.createElement('div');
      overlay.className = 'enlarge';
      overlay.style.position = 'absolute';
      overlay.style.left = frameR.left - mainR.left + 'px';
      overlay.style.top = frameR.top - mainR.top + 'px';
      overlay.style.width = frameR.width + 'px';
      overlay.style.height = frameR.height + 'px';
      overlay.style.opacity = '0';
      overlay.style.zIndex = '30';
      overlay.style.willChange = 'transform, opacity';
      overlay.style.transformOrigin = 'top left';
      overlay.style.transition = `transform ${enlargeTransitionMs}ms ease, opacity ${enlargeTransitionMs}ms ease`;
      const rawSrc = parent.dataset.src || el.querySelector('img')?.src || el.querySelector('video')?.src || '';
      const isVideo = rawSrc.endsWith('.mp4') || rawSrc.endsWith('.webm');
      
      if (isVideo) {
        const video = document.createElement('video');
        video.src = rawSrc;
        video.controls = true;
        video.autoplay = true;
        video.muted = false;
        video.loop = true;
        video.volume = 1.0;
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'contain';
        overlay.appendChild(video);
        
        // Feature 2: Audio Visualization
        const vizCanvas = document.createElement('canvas');
        vizCanvas.className = 'audio-viz-canvas';
        vizCanvas.style.position = 'absolute';
        vizCanvas.style.bottom = '0';
        vizCanvas.style.left = '0';
        vizCanvas.style.width = '100%';
        vizCanvas.style.height = '100px';
        vizCanvas.style.pointerEvents = 'none';
        vizCanvas.style.zIndex = '100';
        overlay.appendChild(vizCanvas);
        
        const vizCtx = vizCanvas.getContext('2d');
        let vizAnimationId = null;
        let audioSource = null;
        
        video.addEventListener('loadedmetadata', () => {
          // Audio visualization - suppress errors as they don't affect functionality
          try {
            if (!audioContextRef.current) {
              audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (!analyserRef.current) {
              analyserRef.current = audioContextRef.current.createAnalyser();
              analyserRef.current.fftSize = 128;
            }
            
            if (!audioSource && !video.dataset.audioConnected) {
              audioSource = audioContextRef.current.createMediaElementSource(video);
              audioSource.connect(analyserRef.current);
              analyserRef.current.connect(audioContextRef.current.destination);
              video.dataset.audioConnected = 'true';
            }
          } catch (e) {
            // Silently handle audio context errors - video will still play
          }
        });
        
        video.addEventListener('play', () => {
          if (!analyserRef.current) return;
          
          const bufferLength = analyserRef.current.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          
          const draw = () => {
            if (video.paused || video.ended) {
              cancelAnimationFrame(vizAnimationId);
              return;
            }
            
            vizAnimationId = requestAnimationFrame(draw);
            analyserRef.current.getByteFrequencyData(dataArray);
            
            vizCanvas.width = vizCanvas.offsetWidth;
            vizCanvas.height = vizCanvas.offsetHeight;
            
            vizCtx.clearRect(0, 0, vizCanvas.width, vizCanvas.height);
            
            const barWidth = vizCanvas.width / bufferLength;
            let x = 0;
            
            for (let i = 0; i < bufferLength; i++) {
              const barHeight = (dataArray[i] / 255) * vizCanvas.height;
              
              const gradient = vizCtx.createLinearGradient(0, vizCanvas.height - barHeight, 0, vizCanvas.height);
              gradient.addColorStop(0, `rgba(168, 85, 247, 0.8)`);
              gradient.addColorStop(0.5, `rgba(59, 130, 246, 0.6)`);
              gradient.addColorStop(1, `rgba(168, 85, 247, 0.3)`);
              
              vizCtx.fillStyle = gradient;
              vizCtx.fillRect(x, vizCanvas.height - barHeight, barWidth - 2, barHeight);
              
              x += barWidth;
            }
          };
          
          draw();
        });
        
        video.addEventListener('pause', () => {
          if (vizAnimationId) cancelAnimationFrame(vizAnimationId);
        });
        
        // Ensure video plays with sound
        video.play().catch(err => {
          // Silently handle autoplay issues - browser will require user interaction
          video.muted = true;
          video.play().then(() => {
            video.addEventListener('click', () => {
              video.muted = false;
              video.volume = 1.0;
            }, { once: true });
          }).catch(() => {
            // Video autoplay completely blocked - user must interact
          });
        });
      } else {
        const img = document.createElement('img');
        img.src = rawSrc;
        overlay.appendChild(img);
      }
      viewerRef.current.appendChild(overlay);
      const tx0 = tileR.left - frameR.left;
      const ty0 = tileR.top - frameR.top;
      const sx0 = tileR.width / frameR.width;
      const sy0 = tileR.height / frameR.height;

      const validSx0 = isFinite(sx0) && sx0 > 0 ? sx0 : 1;
      const validSy0 = isFinite(sy0) && sy0 > 0 ? sy0 : 1;

      overlay.style.transform = `translate(${tx0}px, ${ty0}px) scale(${validSx0}, ${validSy0})`;

      setTimeout(() => {
        if (!overlay.parentElement) return;
        overlay.style.opacity = '1';
        overlay.style.transform = 'translate(0px, 0px) scale(1, 1)';
        rootRef.current?.setAttribute('data-enlarging', 'true');
      }, 16);

      const wantsResize = openedImageWidth || openedImageHeight;
      if (wantsResize) {
        const onFirstEnd = ev => {
          if (ev.propertyName !== 'transform') return;
          overlay.removeEventListener('transitionend', onFirstEnd);
          const prevTransition = overlay.style.transition;
          overlay.style.transition = 'none';
          const tempWidth = openedImageWidth || `${frameR.width}px`;
          const tempHeight = openedImageHeight || `${frameR.height}px`;
          overlay.style.width = tempWidth;
          overlay.style.height = tempHeight;
          const newRect = overlay.getBoundingClientRect();
          overlay.style.width = frameR.width + 'px';
          overlay.style.height = frameR.height + 'px';
          void overlay.offsetWidth;
          overlay.style.transition = `left ${enlargeTransitionMs}ms ease, top ${enlargeTransitionMs}ms ease, width ${enlargeTransitionMs}ms ease, height ${enlargeTransitionMs}ms ease`;
          const centeredLeft = frameR.left - mainR.left + (frameR.width - newRect.width) / 2;
          const centeredTop = frameR.top - mainR.top + (frameR.height - newRect.height) / 2;
          requestAnimationFrame(() => {
            overlay.style.left = `${centeredLeft}px`;
            overlay.style.top = `${centeredTop}px`;
            overlay.style.width = tempWidth;
            overlay.style.height = tempHeight;
          });
          const cleanupSecond = () => {
            overlay.removeEventListener('transitionend', cleanupSecond);
            overlay.style.transition = prevTransition;
          };
          overlay.addEventListener('transitionend', cleanupSecond, { once: true });
        };
        overlay.addEventListener('transitionend', onFirstEnd);
      }
    },
    [enlargeTransitionMs, lockScroll, openedImageHeight, openedImageWidth, segments, unlockScroll]
  );

  const onTileClick = useCallback(
    e => {
      if (draggingRef.current) return;
      if (movedRef.current) return;
      if (performance.now() - lastDragEndAt.current < 80) return;
      if (openingRef.current) return;
      openItemFromElement(e.currentTarget);
    },
    [openItemFromElement]
  );

  const onTilePointerUp = useCallback(
    e => {
      if (e.pointerType !== 'touch') return;
      if (draggingRef.current) return;
      if (movedRef.current) return;
      if (performance.now() - lastDragEndAt.current < 80) return;
      if (openingRef.current) return;
      openItemFromElement(e.currentTarget);
    },
    [openItemFromElement]
  );

  useEffect(() => {
    return () => {
      document.body.classList.remove('dg-scroll-lock');
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (autoRotateRAF.current) {
        cancelAnimationFrame(autoRotateRAF.current);
        autoRotateRAF.current = null;
      }
    };
  }, []);

  // Feature 1: Optimized Particle System with Spotlight
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 20 : 35; // Further reduced for faster loading
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 1.2 + 0.6,
        opacity: Math.random() * 0.3 + 0.15
      });
    }
    particlesRef.current = particles;

    const canvas = document.createElement('canvas');
    canvas.className = 'particle-canvas';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    rootRef.current?.prepend(canvas);

    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    let animationId;
    let frameCount = 0;
    let lastFrameTime = performance.now();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 200);
    };
    window.addEventListener('resize', handleResize);

    const animate = (currentTime) => {
      const deltaTime = currentTime - lastFrameTime;
      
      // Throttle to ~30fps for better performance
      if (deltaTime < 33) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      
      lastFrameTime = currentTime;
      frameCount++;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles (skip every other frame on mobile)
      const skipFrame = isMobile && frameCount % 2 !== 0;
      if (!skipFrame) {
        particles.forEach((p, i) => {
          p.x += p.vx;
          p.y += p.vy;
          
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
          
          // Simplified particle rendering
          ctx.fillStyle = `rgba(168, 85, 247, ${p.opacity})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          
          // Reduce connection drawing (only on desktop, less frequently)
          if (!isMobile && i % 5 === 0 && frameCount % 3 === 0) {
            particles.slice(i + 1, i + 3).forEach(p2 => {
              const dx = p.x - p2.x;
              const dy = p.y - p2.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 80) {
                ctx.strokeStyle = `rgba(168, 85, 247, ${(1 - dist / 80) * 0.15})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
              }
            });
          }
        });
      }
      
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);

    let mouseMoveTimeout;
    const handleMouseMove = (e) => {
      clearTimeout(mouseMoveTimeout);
      mouseMoveTimeout = setTimeout(() => {
        spotlightRef.current = { x: e.clientX, y: e.clientY };
      }, 16); // Throttle mouse movement
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(resizeTimeout);
      clearTimeout(mouseMoveTimeout);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      canvas.remove();
    };
  }, []);

  // Feature 4: Optimized Auto-Rotate with Hover Pause - ULTRA SMOOTH SLOW MOTION
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    let lastTime = performance.now();
    const targetFPS = isMobile ? 30 : 60;
    const frameDelay = 1000 / targetFPS;
    
    // SLOW MOTION rotation speed - degrees per second (ultra-slow for cinematic, attractive look)
    const maxRotationSpeed = isMobile ? 1.5 : 2; // degrees per second for slow motion, elegant effect
    const acceleration = 0.15; // Even slower acceleration for ultra-smooth graceful start/stop
    
    const autoRotate = (currentTime) => {
      const deltaTime = Math.min(currentTime - lastTime, 100); // Cap delta to prevent jumps
      
      if (deltaTime >= frameDelay) {
        const shouldRotate = !isHoveringTileRef.current && !draggingRef.current && !focusedElRef.current;
        
        if (shouldRotate) {
          // Smoothly accelerate to target speed
          autoRotateSpeedRef.current = Math.min(
            autoRotateSpeedRef.current + acceleration,
            maxRotationSpeed
          );
        } else {
          // Smoothly decelerate to stop
          autoRotateSpeedRef.current = Math.max(
            autoRotateSpeedRef.current - acceleration * 2,
            0
          );
        }
        
        if (autoRotateSpeedRef.current > 0.01) {
          // Calculate smooth rotation based on actual elapsed time and current speed
          const rotationDelta = (autoRotateSpeedRef.current * deltaTime) / 1000;
          const nextY = wrapAngleSigned(rotationRef.current.y + rotationDelta);
          rotationRef.current.y = nextY;
          
          // Use CSS transitions for ultra-smooth rendering
          const sphereEl = sphereRef.current;
          if (sphereEl) {
            // Adaptive transition timing based on frame delay
            sphereEl.style.transition = `transform ${Math.floor(frameDelay)}ms linear`;
            applyTransform(rotationRef.current.x, nextY);
          }
        }
        
        lastTime = currentTime;
      }
      autoRotateRAF.current = requestAnimationFrame(autoRotate);
    };
    autoRotateRAF.current = requestAnimationFrame(autoRotate);

    return () => {
      if (autoRotateRAF.current) {
        cancelAnimationFrame(autoRotateRAF.current);
        autoRotateRAF.current = null;
      }
    };
  }, []);

  // Feature 5: Optimized Color-Adaptive Lighting
  const updateAmbientColor = useCallback((element) => {
    // Disable on mobile for better performance
    if (window.innerWidth < 768) return;
    
    const media = element.querySelector('img, video');
    if (!media) return;

    // Throttle color updates
    const now = performance.now();
    if (element.dataset.lastColorUpdate && now - parseFloat(element.dataset.lastColorUpdate) < 500) {
      return;
    }
    element.dataset.lastColorUpdate = now.toString();

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    canvas.width = 30;
    canvas.height = 30;

    try {
      if (media.tagName === 'VIDEO' && media.readyState >= 2) {
        ctx.drawImage(media, 0, 0, 30, 30);
      } else if (media.tagName === 'IMG' && media.complete) {
        ctx.drawImage(media, 0, 0, 30, 30);
      } else {
        return;
      }

      const imageData = ctx.getImageData(0, 0, 30, 30).data;
      let r = 0, g = 0, b = 0, count = 0;

      for (let i = 0; i < imageData.length; i += 4) {
        r += imageData[i];
        g += imageData[i + 1];
        b += imageData[i + 2];
        count++;
      }

      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);

      const color = `rgb(${r}, ${g}, ${b})`;
      currentColorRef.current = color;
      rootRef.current?.style.setProperty('--adaptive-color', color);
    } catch (e) {
      // Silently fail for cross-origin images
    }
  }, []);

  return (
    <div
      ref={rootRef}
      className="sphere-root"
      style={{
        ['--segments-x']: segments,
        ['--segments-y']: segments,
        ['--overlay-blur-color']: overlayBlurColor,
        ['--tile-radius']: imageBorderRadius,
        ['--enlarge-radius']: openedImageBorderRadius,
        ['--image-filter']: grayscale ? 'grayscale(1)' : 'none',
        ['--adaptive-color']: currentColorRef.current
      }}
    >
      {!imagesLoaded && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          background: 'rgba(10, 10, 15, 0.8)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(168, 85, 247, 0.2)',
            borderTop: '4px solid #a855f7',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      )}
      <main ref={mainRef} className="sphere-main" style={{ opacity: imagesLoaded ? 1 : 0.3 }}>
        <div className="stage">
          <div ref={sphereRef} className="sphere">
            {items.map((it, i) => (
              <div
                key={`${it.x},${it.y},${i}`}
                className="item"
                data-src={it.src}
                data-offset-x={it.x}
                data-offset-y={it.y}
                data-size-x={it.sizeX}
                data-size-y={it.sizeY}
                style={{
                  ['--offset-x']: it.x,
                  ['--offset-y']: it.y,
                  ['--item-size-x']: it.sizeX,
                  ['--item-size-y']: it.sizeY
                }}
              >
                <div
                  className="item__image"
                  role="button"
                  tabIndex={0}
                  aria-label={it.alt || 'Open image'}
                  onClick={onTileClick}
                  onPointerUp={onTilePointerUp}
                  onMouseEnter={(e) => {
                    isHoveringTileRef.current = true;
                    updateAmbientColor(e.currentTarget);
                  }}
                  onMouseLeave={() => {
                    isHoveringTileRef.current = false;
                  }}
                >
                  {it.src.endsWith('.mp4') || it.src.endsWith('.webm') ? (
                    <video 
                      src={it.src} 
                      draggable={false} 
                      muted 
                      loop 
                      playsInline
                      preload="none"
                      loading="lazy"
                      crossOrigin="anonymous"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', backgroundColor: 'rgba(168, 85, 247, 0.1)' }}
                      onLoadedMetadata={(e) => {
                        e.target.currentTime = 1;
                      }}
                      onLoadedData={(e) => {
                        e.target.style.opacity = '1';
                        e.target.style.backgroundColor = 'transparent';
                      }}
                      onCanPlay={(e) => {
                        e.target.style.opacity = '1';
                        e.target.style.backgroundColor = 'transparent';
                      }}
                      onMouseEnter={(e) => {
                        e.target.play().catch(() => {});
                      }}
                      onMouseLeave={(e) => {
                        e.target.pause();
                        e.target.currentTime = 1;
                      }}
                      onError={(e) => {
                        e.target.style.opacity = '0.7';
                        e.target.style.backgroundColor = 'rgba(168, 85, 247, 0.15)';
                      }}
                    />
                  ) : (
                    <img 
                      src={it.src} 
                      draggable={false} 
                      alt={it.alt}
                      loading={i < 20 ? "eager" : "lazy"}
                      decoding="async"
                      fetchpriority={i < 10 ? "high" : "auto"}
                      onLoad={(e) => {
                        e.target.style.opacity = '1';
                      }}
                      onError={(e) => {
                        e.target.style.opacity = '0.7';
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="overlay" />
        <div className="overlay overlay--blur" />
        <div className="edge-fade edge-fade--top" />
        <div className="edge-fade edge-fade--bottom" />

        <div className="viewer" ref={viewerRef}>
          <div ref={scrimRef} className="scrim" />
          <div ref={frameRef} className="frame" />
        </div>
      </main>
    </div>
  );
}
