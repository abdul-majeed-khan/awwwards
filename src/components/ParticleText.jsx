import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const ParticleText = ({ text = "NEXUS", fontSize = 120 }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Get text particles
    const getTextParticles = () => {
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

    //   const textMetrics = ctx.measureText(text);
    //   const textWidth = textMetrics.width;
    //   const textHeight = fontSize;

      // Position text in center
      ctx.fillText(
        text, 
        canvas.width / 2,
        canvas.height / 2
      );

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      const particles = [];
      
      // Sample points from text
      for (let y = 0; y < canvas.height; y += 4) {
        for (let x = 0; x < canvas.width; x += 4) {
          const index = (y * canvas.width + x) * 4;
          if (pixels[index + 3] > 128) { // If pixel is visible
            const particle = {
              originX: x,
              originY: y,
              x: x,
              y: y,
              vx: 0,
              vy: 0,
              size: 2,
              color: 'gray',
              distanceFromMouse: 0,
              forceDirectionX: 0,
              forceDirectionY: 0
            };
            particles.push(particle);
          }
        }
      }
      
      return particles;
    };

    // Initialize particles
    particlesRef.current = getTextParticles();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach(particle => {
        // Calculate distance from mouse
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const repelRadius = 100;

        if (isHovering && distance < repelRadius) {
          // Repel particles from mouse
          const force = (repelRadius - distance) / repelRadius;
          particle.vx -= (dx / distance) * force * 2;
          particle.vy -= (dy / distance) * force * 2;
        } else {
          // Return to original position
          const dx = particle.originX - particle.x;
          const dy = particle.originY - particle.y;
          particle.vx += dx * 0.02;
          particle.vy += dy * 0.02;
        }

        // Apply friction
        particle.vx *= 0.97;
        particle.vy *= 0.97;

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Add glow effect
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', () => setIsHovering(true));
    canvas.addEventListener('mouseleave', () => setIsHovering(false));
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(frameRef.current);
    };
  }, [isHovering, fontSize, text]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-screen"
      style={{ background: 'transparent' }}
    />
  );
};
ParticleText.propTypes = {
  text: PropTypes.string,
  fontSize: PropTypes.number
};

export default ParticleText;