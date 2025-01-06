import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import PropTypes from 'prop-types'

const AnimatedTitle = ({ title, containerClass, effect = 'default' }) => {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      let titleAnimation = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          end: "bottom center",
          toggleActions: "play none none reverse",
        }
      });

      // Initial state for all effects
      gsap.set(".animated-word", {
        opacity: 0,
        transform: getInitialTransform(effect),
      });

      switch(effect) {
        case 'wave':
          titleAnimation.to(".animated-word", {
            opacity: 1,
            transform: 'translate3d(0,0,0)',
            rotateZ: 0,
            ease: 'elastic.out(1, 0.3)',
            stagger: {
              amount: 0.8,
              from: "start"
            }
          });
          break;

        case 'spiral':
          titleAnimation.to(".animated-word", {
            opacity: 1,
            transform: 'translate3d(0,0,0) rotate(0deg)',
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            ease: 'power4.out',
            stagger: {
              amount: 0.6,
              from: "center"
            }
          });
          break;

        case 'shuffle':
          titleAnimation.to(".animated-word", {
            opacity: 1,
            transform: 'translate3d(0,0,0)',
            rotationX: 0,
            ease: 'back.out(1.7)',
            stagger: {
              amount: 0.5,
              from: "random"
            }
          });
          break;

        case 'glitch':
          // Add glitch effect CSS class
          document.querySelectorAll('.animated-word').forEach(word => {
            word.classList.add('glitch-effect');
          });
          
          titleAnimation.to(".animated-word", {
            opacity: 1,
            transform: 'translate3d(0,0,0)',
            duration: 0.8,
            ease: 'power2.out',
            stagger: 0.05,
          });
          break;

        default:
          titleAnimation.to(".animated-word", {
            opacity: 1,
            transform: 'translate3d(0,0,0) rotate(0deg) rotateX(0deg)',
            ease: 'power1.inOut',
            stagger: 0.04,
          });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [effect]);

  // Helper function to get initial transform based on effect
  const getInitialTransform = (effectType) => {
    switch(effectType) {
      case 'wave':
        return 'translate3d(0,100%,0) rotate(-10deg)';
      case 'spiral':
        return 'translate3d(0,100%,0) rotate(180deg) scale(0)';
      case 'shuffle':
        return 'translate3d(0,-100%,0) rotateX(-90deg)';
      case 'glitch':
        return 'translate3d(-20px,0,0)';
      default:
        return 'translate3d(0,50%,0)';
    }
  };

  return (
    <div ref={containerRef} className={`animated-title ${containerClass}`}>
      {title.split('<br />').map((line, index) => (
        <div 
          key={index} 
          className="flex-center max-w-full flex-wrap gap-2 px-10 md:gap-3"
        >
          {line.split(' ').map((word, i) => (
            <span
              key={i}
              className="animated-word"
              dangerouslySetInnerHTML={{ __html: word }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

AnimatedTitle.propTypes = {
  title: PropTypes.string.isRequired,
  containerClass: PropTypes.string,
  effect: PropTypes.oneOf(['default', 'wave', 'spiral', 'shuffle', 'glitch'])
}

export default AnimatedTitle