import { useEffect, useRef, useState } from 'react';

const MagneticParticles = () => {
  const containerRef = useRef(null);
  const frameRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const PARTICLES_COUNT = 100;

  // Colors matching your website's theme
  const colors = [
    { bg: 'bg-cyan-200', glow: '#22D3EE' },     // Cyan
    { bg: 'bg-purple-200', glow: '#A78BFA' },   // Purple
    { bg: 'bg-pink-200', glow: '#EC4899' },     // Pink
    { bg: 'bg-blue-500', glow: '#60A5FA' },     // Blue
  ];
  
  const [particles] = useState(() => 
    Array.from({ length: PARTICLES_COUNT }, () => {
      const colorIndex = Math.floor(Math.random() * colors.length);
      const baseSize = Math.random() * 2 + 1; // Slightly smaller particles
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: baseSize,
        vx: 0,
        vy: 0,
        originX: Math.random() * window.innerWidth,
        originY: Math.random() * window.innerHeight,
        color: colors[colorIndex].bg,
        glowColor: colors[colorIndex].glow,
        pulseSpeed: 0.3 + Math.random() * 0.7, // Slower pulse
        pulseOffset: Math.random() * Math.PI * 2,
      };
    })
  );

  const particlesRef = useRef(particles);

  useEffect(() => {
    let startTime = Date.now();

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = (currentTime - startTime) / 1000;

      particlesRef.current.forEach((particle, i) => {
        const el = document.getElementById(`particle-${i}`);
        if (!el) return;

        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const radius = 200;
        
        if (distance < radius) {
          const force = (radius - distance) / radius;
          particle.vx += (dx / distance) * force * 0.8;
          particle.vy += (dy / distance) * force * 0.8;
        } else {
          const dx = particle.originX - particle.x;
          const dy = particle.originY - particle.y;
          particle.vx += dx * 0.01;
          particle.vy += dy * 0.01;
        }
        
        particle.vx *= 0.95;
        particle.vy *= 0.95;
        particle.x += particle.vx;
        particle.y += particle.vy;

        const pulsePhase = elapsed * particle.pulseSpeed + particle.pulseOffset;
        const pulseScale = 1 + Math.sin(pulsePhase) * 0.15; // Reduced pulse intensity
        
        el.style.transform = `translate(${particle.x}px, ${particle.y}px) scale(${pulseScale})`;
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    frameRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      particlesRef.current = particlesRef.current.map(particle => ({
        ...particle,
        originX: Math.random() * window.innerWidth,
        originY: Math.random() * window.innerHeight
      }));
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
      style={{ zIndex: 0 }} // Lower z-index to not interfere with other elements
    >
      {particles.map((particle, i) => (
        <div
          key={i}
          id={`particle-${i}`}
          className={`absolute rounded-full ${particle.color}`}
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            willChange: 'transform',
            opacity: 0.6, // Reduced opacity
            boxShadow: `
              0 0 ${particle.size * 2}px ${particle.size * 0.8}px ${particle.glowColor}88,
              0 0 ${particle.size * 3}px ${particle.size * 1.5}px ${particle.glowColor}44
            `,
          }}
        />
      ))}
    </div>
  );
};

export default MagneticParticles;