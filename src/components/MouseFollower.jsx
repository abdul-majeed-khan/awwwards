import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const lerp = (start, end, factor) => start + (end - start) * factor;

const MouseFollower = ({ 
  color = "bg-blue-500", 
  size = "w-6 h-6",
  speed = 0.15,
  opacity = "opacity-100",
  className = "",
  enabled = true
}) => {
  const followerRef = useRef(null);
  const frameRef = useRef(0);
  const currentPos = useRef({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      if (followerRef.current) {
        // Smoothly interpolate position
        currentPos.current.x = lerp(currentPos.current.x, targetPos.current.x, speed);
        currentPos.current.y = lerp(currentPos.current.y, targetPos.current.y, speed);

        followerRef.current.style.transform = `translate(${currentPos.current.x}px, ${currentPos.current.y}px)`;
      }
      frameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(frameRef.current);
    };
  }, [speed, enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={followerRef}
      className={`fixed pointer-events-none rounded-full transition-opacity duration-300 ${color} ${size} ${opacity} ${className}`}
      style={{ 
        transform: 'translate(-50%, -50%)',
        willChange: 'transform',
        zIndex: 50
      }}
    />
  );
};

const MultipleFollowers = () => {
  return (
    <>
      {/* Main follower - fastest */}
      <MouseFollower 
        color="bg-blue-500"
        size="w-4 h-4"
        speed={0.2}
        opacity="opacity-90"
      />
      
      {/* Medium follower */}
      <MouseFollower 
        color="bg-purple-500"
        size="w-8 h-8"
        speed={0.1}
        opacity="opacity-60"
      />
      
      {/* Slowest, largest follower */}
      <MouseFollower 
        color="bg-pink-500"
        size="w-12 h-12"
        speed={0.05}
        opacity="opacity-40"
      />
    </>
  );
};
MouseFollower.propTypes = {
  color: PropTypes.string,
  size: PropTypes.string,
  speed: PropTypes.number,
  opacity: PropTypes.string,
  className: PropTypes.string,
  enabled: PropTypes.bool,
};

export { MouseFollower, MultipleFollowers };
