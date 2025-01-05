import { useState, useRef, useEffect } from 'react';
import Button from './Button';
import { TiLocationArrow } from 'react-icons/ti';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [preloadedImages, setPreloadedImages] = useState({});
  
  const totalImages = 4;
  const nextImageRef = useRef(null);
  const imageCache = useRef({});

  // Function to get image URL
  const getImageSrc = (index) => `/img/planet-${index}.jpg`;

  // Preload all images
  useEffect(() => {
    const preloadImages = async () => {
      const loadImage = (src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            imageCache.current[src] = img;
            resolve(src);
          };
          img.onerror = reject;
        });
      };

      try {
        const imagePromises = [];
        for (let i = 1; i <= totalImages; i++) {
          imagePromises.push(loadImage(getImageSrc(i)));
        }
        
        const loadedImages = await Promise.all(imagePromises);
        setPreloadedImages(loadedImages.reduce((acc, src) => {
          acc[src] = true;
          return acc;
        }, {}));
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error preloading images:', error);
        setIsLoading(false);
      }
    };

    preloadImages();
  }, [preloadedImages]);

  const upcomingImageIndex = (currentIndex % totalImages) + 1;

  const handleMiniImageClick = () => {
    if (!isLoading) {
      setHasClicked(true);
      setCurrentIndex(upcomingImageIndex);
    }
  };

  // GSAP Animations
  useGSAP(() => {
    if (hasClicked && !isLoading) {
      // Create a timeline for better sequencing
      const tl = gsap.timeline();
  
      // First, set initial state of next image
      tl.set('#next-image', { 
        visibility: 'visible',
        opacity: 0,
        scale: 0.5
      });
  
      // Animate current image scaling down
      tl.to('#current-image', {
        transformOrigin: 'center center',
        scale: 0,
        opacity: 0,
        duration: 0.75,
        ease: 'power2.inOut',
      });
  
      // After current image scales down, animate next image scaling up
      tl.to('#next-image', {
        transformOrigin: 'center center',
        scale: 1,
        width: '100%',
        height: '100%',
        opacity: 1,
        duration: 0.75,
        ease: 'power2.inOut',
      });
    }
  }, {
    dependencies: [currentIndex, isLoading], 
    revertOnUpdate: true,
  });

  // Heading scroll animation
  useGSAP(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth <= 768; // Check if mobile viewport
    
      // Set x values based on screen size
      const xOffset = isMobile ? 80 : 350; 
      const yOffset = isMobile ? 600 : 600;  
      const xxOffset = isMobile ? 80 : 350;  
      const yyOffset = isMobile ? 148 : 12;  

      // Animation for "REDEFINE" coming down and right
      gsap.fromTo(".scroll-heading",
        { y: 0, x: 0 },
        {
          y: yOffset,
          x: xOffset,
          smooth: 2,
          effects: true,
          scrollTrigger: {
            trigger: "#video-frame",
            start: "top top",
            end: "bottom center",
            scrub: true,
            toggleActions: "play none none reverse"
          }
        }
      );
  
      // Animation for "GAMING" going up and left
      gsap.fromTo(".bottom-heading",
        { y: 0, x: 0 },
        {
          y: -yyOffset,
          x: -xxOffset,
          smooth: 2,
          effects: true,
          scrollTrigger: {
            trigger: "#video-frame",
            start: "top top",
            end: "bottom center",
            scrub: true,
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  
    return () => ctx.revert();
  }, []);

  useGSAP(() => {
    gsap.set("#video-frame", {
      clipPath: "polygon(89% 86%, 37% 0, 89% 86%, 8% 68%)",
      borderRadius: "0% 0% 40% 10%",
    });
    gsap.from("#video-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0% 0% 0% 0%",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#video-frame",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  });

  return (
    <div className="relative h-dvh w-screen overflow-hidden">
      {isLoading && (
        <div className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-violet-50">
          <div className="three-body">
            <div className="three-body__dot" />
            <div className="three-body__dot" />
            <div className="three-body__dot" />
          </div>
        </div>
      )}
      
      <div id="video-frame" className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75">
        <div>
          <div className="mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg">
            <div 
              onClick={handleMiniImageClick} 
              className={`origin-center scale-50 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100
                ${isLoading ? 'opacity-0' : 'opacity-0 hover:opacity-100'}`}
            >
              <img 
                ref={nextImageRef}
                src={getImageSrc(upcomingImageIndex)}
                alt={`Hero ${upcomingImageIndex}`}
                id="current-image"
                className="size-64 origin-center scale-150 object-cover object-center"
              />
            </div>
          </div>
          
          <img 
            ref={nextImageRef}
            src={getImageSrc(currentIndex)}
            alt={`Hero ${currentIndex}`}
            id="next-image"
            className="absolute-center invisible absolute z-20 size-64 object-cover object-center"
          />

          <img 
            src={getImageSrc(currentIndex === totalImages - 1 ? 1 : currentIndex)}
            alt="Hero main"
            className="absolute-center left-0 top-0 size-full object-cover object-center"
          />
        </div>

        <div className="absolute left-0 lg:top-48 top-16 z-40 size-full">
          <div className="mt-24 px-5 sm:px-10">
            <p className="mb-5 max-w-64 font-robert-regular text-blue-100">
              Enter the Metagame Layer <br /> Unleash the Play Economy
            </p>
            <Button 
              id="watch-trailer" 
              title="Watch Trailer" 
              leftIcon={<TiLocationArrow />} 
              containerClass="!bg-yellow-300 flex-center gap-1"
            />
          </div>
        </div>
      </div>
      
      <h1 className="special-font hero-heading scroll-heading absolute top-24 left-0 px-5 sm:px-10 text-blue-100 z-40">
        Redefi<b>n</b>e
      </h1>
      
      <h1 className="special-font hero-heading bottom-heading absolute bottom-5 right-5 text-blue-100 z-40">
        G<b>a</b>ming
      </h1>
    </div>
  );
};

export default Hero;