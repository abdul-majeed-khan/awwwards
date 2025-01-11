import About from "./components/About"
import Hero from "./components/Hero"
import Collaboration from "./components/Skills"
import Navbar from "./components/Navbar"
import Features from './components/Features'
import MagneticParticles from "./components/MagneticParticles"
import Particle from "./components/Particle"
import Footer from "./components/footer"


const App = () => {
  return (
    <main className="relative bg-black min-h-screen w-screen overflow-x-hidden">
      <MagneticParticles />
      <Navbar />
      <Hero />
      <About />
      <Features />
      <Particle />
      <Footer />
    </main>
  )
}

export default App