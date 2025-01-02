import { useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import ScrollToPlugin from 'gsap/ScrollToPlugin'
import About from "./components/About"
import Hero from "./components/Hero"
import Navbar from "./components/Navbar"

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const App = () => {
  useEffect(() => {
    // Default ScrollTrigger configuration
    ScrollTrigger.defaults({
      start: "top center",
      end: "bottom center",
      scrub: 1,
    });

    // Configure smooth scrolling
    gsap.to("html", {
      scrollBehavior: "smooth",
      scrollTrigger: {
        start: "top top",
        end: "bottom bottom",
        scrub: 1
      }
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <About />
    </main>
  )
}

export default App