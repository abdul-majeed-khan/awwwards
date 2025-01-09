import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import gsap from 'gsap';

const HyperText = ({ text, className }) => {
  const elementRef = useRef(null);
  
  useEffect(() => {
    const element = elementRef.current;
    const letters = element.querySelectorAll('.letter');
    
    // Initial setup
    gsap.set(letters, { 
      opacity: 0,
      y: 100,
      scale: 0.9,
      rotationX: -90
    });

    // Create main timeline
    const tl = gsap.timeline();

    // Reveal animation with stagger effect
    tl.to(letters, {
      opacity: 1,
      y: 0,
      scale: 1,
      rotationX: 0,
      duration: 1,
      stagger: {
        each: 0.1,
        ease: "power4.out"
      },
      ease: "back.out(1.7)"
    });

    // Hover effect
    const handleMouseEnter = () => {
      gsap.to(letters, {
        scale: 1.05,
        duration: 0.3,
        stagger: {
          each: 0.02,
          from: "random"
        }
      });
    };

    const handleMouseLeave = () => {
      gsap.to(letters, {
        scale: 1,
        duration: 0.3,
        stagger: {
          each: 0.02,
          from: "random"
        }
      });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      gsap.killTweensOf(letters);
    };
  }, []);

  // Create letters with glow effects
  const letters = text.split('').map((letter, index) => (
    <span 
      key={index} 
      className="letter relative inline-block transition-transform will-change-transform"
      style={{ display: letter === ' ' ? 'inline' : 'inline-block' }}
    >
      {/* Glow layers */}
      <span className="absolute inset-0 blur-[2px] text-blue-100/30">
        {letter}
      </span>
      <span className="absolute inset-0 blur-md text-blue-100/20">
        {letter}
      </span>
      
      {/* Base layer with glow */}
      <span className="relative text-blue-100" style={{ 
        filter: 'drop-shadow(0 0 8px rgba(191, 219, 254, 0.3))',
      }}>
        {letter}
      </span>
    </span>
  ));

  return (
    <h1 
      ref={elementRef} 
      className={`cursor-pointer select-none perspective-[1000px] ${className}`}
    >
      {letters}
    </h1>
  );
};

HyperText.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default HyperText;