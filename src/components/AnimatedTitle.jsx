import { useEffect } from 'react'
import { useRef } from 'react'
import gsap from 'gsap'
import PropTypes from 'prop-types'

const AnimatedTitle = ({ title, containerClass }) => {
  const containerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() =>{
      const titleAnimation = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60% bottom",
          end: "bottom center",
          toggleActions: "play none none reverse",
        }
      });
      titleAnimation.to(".animated-word", {
        opacity: 1,
        transform: 'translate3d(0,0,0) rotate(0deg) rotateX(0deg)',
        ease: 'power1.inOut',
        stagger: 0.04,
      })
    },containerRef)
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={`animated-title ${containerClass}`}>
        {title.split('<br />').map((line, index) => (
          <div key={index} className="flex-center max-w-full flex-wrap gap-2 px-10 md:gap-3">
            {line.split(' ').map((word, i) => (
              <span key={i} className="animated-word" dangerouslySetInnerHTML={{ __html: word }} />
            ))}
          </div>
        ))}
    </div>
  )
}
AnimatedTitle.propTypes = {
  title: PropTypes.string.isRequired,
  containerClass: PropTypes.string
}

export default AnimatedTitle