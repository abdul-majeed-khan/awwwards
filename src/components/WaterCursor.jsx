import { useEffect, useRef } from 'react';

const lerp = (start, end, factor) => start + (end - start) * factor;

const WaterCursor = () => {
  const cursorRef = useRef(null);
  const rippleRefs = useRef([]);
  const frameRef = useRef(0);
  const currentPos = useRef({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0 });
  const prevPos = useRef({ x: 0, y: 0 });
  const ripples = useRef([]);
  const MAX_RIPPLES = 5;

  const createRipple = (x, y) => {
    return {
      x,
      y,
      scale: 0,
      opacity: 0.5,
      timestamp: Date.now()
    };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      
      // Create new ripple when mouse moves significantly
      const distance = Math.hypot(
        targetPos.current.x - prevPos.current.x,
        targetPos.current.y - prevPos.current.y
      );
      
      if (distance > 20) {
        ripples.current.unshift(createRipple(e.clientX, e.clientY));
        if (ripples.current.length > MAX_RIPPLES) {
          ripples.current.pop();
        }
        prevPos.current = { x: targetPos.current.x, y: targetPos.current.y };
      }
    };

    const animate = () => {
      if (cursorRef.current) {
        // Smooth cursor movement
        currentPos.current.x = lerp(currentPos.current.x, targetPos.current.x, 0.15);
        currentPos.current.y = lerp(currentPos.current.y, targetPos.current.y, 0.15);

        cursorRef.current.style.transform = `translate(${currentPos.current.x}px, ${currentPos.current.y}px)`;

        // Animate ripples
        ripples.current.forEach((ripple, index) => {
          const age = Date.now() - ripple.timestamp;
          ripple.scale = Math.min(age / 300, 1.5);
          ripple.opacity = Math.max(0.5 - age / 1000, 0);

          if (rippleRefs.current[index]) {
            rippleRefs.current[index].style.transform = `translate(${ripple.x}px, ${ripple.y}px) scale(${ripple.scale})`;
            rippleRefs.current[index].style.opacity = ripple.opacity;
          }
        });

        // Remove old ripples
        ripples.current = ripples.current.filter(ripple => ripple.opacity > 0);
      }
      frameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <>
      {/* Main cursor */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none"
        style={{
          transform: 'translate(-50%, -50%)',
          willChange: 'transform',
          zIndex: 50
        }}
      >
        <div className="w-8 h-8 rounded-full bg-cyan-400 blur-sm opacity-40" />
      </div>

      {/* Ripples container */}
      <div className="fixed inset-0 pointer-events-none">
        {Array.from({ length: MAX_RIPPLES }).map((_, index) => (
          <div
            key={index}
            ref={el => rippleRefs.current[index] = el}
            className="absolute w-16 h-16 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="w-full h-full rounded-full bg-cyan-400/30 blur-md" />
          </div>
        ))}
      </div>
    </>
  );
};

export default WaterCursor;