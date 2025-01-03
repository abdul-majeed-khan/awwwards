import { useEffect, useRef } from 'react';

const MagneticParticles = () => {
  const containerRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef(0);
  const PARTICLES_COUNT = 30;
  
  // Generate random particles
  const createParticle = (index) => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 3 + 1,
    vx: 0,
    vy: 0,
    originX: Math.random() * window.innerWidth,
    originY: Math.random() * window.innerHeight,
    color: [
      'bg-blue-400',
      'bg-purple-400',
      'bg-pink-400',
      'bg-cyan-400'
    ][Math.floor(Math.random() * 4)]
  });

  useEffect(() => {
    // Initialize particles
    particlesRef.current = Array.from({ length: PARTICLES_COUNT }, (_, i) => 
      createParticle(i)
    );

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      particlesRef.current.forEach((particle, index) => {
        const el = document.getElementById(`particle-${index}`);
        if (!el) return;

        // Calculate distance from cursor
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Magnetic effect radius
        const radius = 200;
        
        if (distance < radius) {
          // Attracted to cursor
          const force = (radius - distance) / radius;
          particle.vx += (dx / distance) * force * 0.8;
          particle.vy += (dy / distance) * force * 0.8;
        } else {
          // Return to original position
          const dx = particle.originX - particle.x;
          const dy = particle.originY - particle.y;
          particle.vx += dx * 0.01;
          particle.vy += dy * 0.01;
        }
        
        // Apply friction
        particle.vx *= 0.95;
        particle.vy *= 0.95;
        
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Update DOM element
        el.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    frameRef.current = requestAnimationFrame(animate);

    // Handle window resize
    const handleResize = () => {
      particlesRef.current.forEach(particle => {
        particle.originX = Math.random() * window.innerWidth;
        particle.originY = Math.random() * window.innerHeight;
      });
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 50 }}
    >
      {Array.from({ length: PARTICLES_COUNT }).map((_, index) => (
        <div
          key={index}
          id={`particle-${index}`}
          className={`absolute rounded-full opacity-70 shadow-lg 
            ${particlesRef.current[index]?.color || 'bg-blue-400'}`}
          style={{
            width: `${particlesRef.current[index]?.size || 2}px`,
            height: `${particlesRef.current[index]?.size || 2}px`,
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  );
};

export default MagneticParticles;