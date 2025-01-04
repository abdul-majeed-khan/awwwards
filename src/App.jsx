import About from "./components/About"
import Hero from "./components/Hero"
import Navbar from "./components/Navbar"
import Features from './components/Features'
import MagneticParticles from "./components/MagneticParticles"


const App = () => {
  return (
    <main className="relative bg-black min-h-screen w-screen overflow-x-hidden">
      <MagneticParticles />
      <Navbar />
      <Hero />
      <About />
      <Features />
    </main>
  )
}

export default App