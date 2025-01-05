import { useEffect, useRef } from 'react';

const DigitalRain = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateCanvasSize();

    class Drop {
      constructor(x) {
        this.x = x;
        this.y = Math.random() * -100;
        this.speed = 1 + Math.random() * 3;
        this.characters = [];
        this.updateInterval = 50 + Math.random() * 100;
        this.lastUpdate = 0;
        
        // Generate random characters
        const length = 15 + Math.floor(Math.random() * 15);
        for (let i = 0; i < length; i++) {
          this.characters.push({
            char: String.fromCharCode(0x30A0 + Math.random() * 96),
            alpha: i === 0 ? 1 : 0.3 + (i / length) * 0.7
          });
        }
      }

      update(time) {
        this.y += this.speed;

        // Update characters periodically
        if (time - this.lastUpdate > this.updateInterval) {
          this.characters.forEach(char => {
            char.char = String.fromCharCode(0x30A0 + Math.random() * 96);
          });
          this.lastUpdate = time;
        }

        // Reset when offscreen
        if (this.y > canvas.height + 100) {
          this.y = Math.random() * -100;
        }
      }

      draw() {
        ctx.font = '15px monospace';
        
        this.characters.forEach((char, i) => {
          const y = this.y + i * 15;
          if (y > 0 && y < canvas.height) {
            // Leading character (brighter)
            if (i === 0) {
              ctx.fillStyle = '#60A5FA';
              ctx.shadowColor = '#60A5FA';
              ctx.shadowBlur = 10;
            } else {
              // Trail characters (dimmer)
              ctx.fillStyle = `rgba(96, 165, 250, ${char.alpha})`;
              ctx.shadowBlur = 0;
            }
            ctx.fillText(char.char, this.x, y);
          }
        });
      }
    }

    // Create drops
    const columns = Math.floor(canvas.width / 15);
    const drops = Array.from({ length: columns }, (_, i) => new Drop(i * 15));
    particlesRef.current = drops;

    const animate = (time) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach(drop => {
        drop.update(time);
        drop.draw();
      });

      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', updateCanvasSize);
    requestAnimationFrame(animate);

    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-screen"
      style={{ background: 'black' }}
    />
  );
};

export default DigitalRain;