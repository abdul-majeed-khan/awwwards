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
      opacity: 0
    });

    // Simple fade-in animation
    gsap.to(letters, {
      opacity: 1,
      duration: 0.8,
      stagger: {
        each: 0.05,
        ease: "power2.out"
      }
    });

    // Hover effect
    const handleMouseEnter = () => {
      gsap.to(letters, {
        opacity: 0.7,
        duration: 0.3
      });
    };

    const handleMouseLeave = () => {
      gsap.to(letters, {
        opacity: 1,
        duration: 0.3
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

  // Create letters
  const letters = text.split(/(<b>|<\/b>)/).map((part, partIndex) => {
    if (part === '<b>' || part === '</b>') return null;
    
    const isBold = text.slice(0, text.indexOf(part)).split('<b>').length > 
                   text.slice(0, text.indexOf(part)).split('</b>').length;

    return part.split('').map((letter, letterIndex) => (
      <span 
        key={`${partIndex}-${letterIndex}`} 
        className="letter relative inline-block"
        style={{ display: letter === ' ' ? 'inline' : 'inline-block' }}
      >
        <span 
          className="relative bg-gradient-to-r from-gray-500 to-purple-100 bg-clip-text text-transparent"
          style={{ 
            filter: 'drop-shadow(0 0 8px rgba(191, 219, 254, 0.3))',
            fontFeatureSettings: isBold ? '"ss01" on' : 'normal'
          }}
        >
          {letter}
        </span>
      </span>
    ))
  }).filter(Boolean).flat();

  return (
    <h1 
      ref={elementRef} 
      className={`cursor-pointer select-none ${className}`}
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