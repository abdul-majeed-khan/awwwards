import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const TextReveal = ({ text, className }) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    const letters = (element as HTMLElement).querySelectorAll('.letter');
    
    gsap.set(letters, { 
      y: 100,
      opacity: 0 
    });

    gsap.to(letters, {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.1,
      ease: "power4.out",
      scrollTrigger: {
        trigger: element,
        start: "top center",
        toggleActions: "play none none reverse"
      }
    });
  }, []);

  // Split text into individual letters
  const letters = text.split('').map((letter, index) => (
    <span 
      key={index} 
      className="letter inline-block"
      style={{ display: letter === ' ' ? 'inline' : 'inline-block' }}
    >
      {letter}
    </span>
  ));

  return (
    <h1 ref={elementRef} className={className}>
      {letters}
    </h1>
  );
};

export default TextReveal;