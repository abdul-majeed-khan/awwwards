import ParticleText from "./ParticleText";
import DigitalRain from "./DigitalRain"

const Particle = () => {
  return (
    <section className="relative min-h-screen w-screen bg-white pb-52">
      <DigitalRain />
        <div className="absolute inset-0">
            <ParticleText text="NEXUS" fontSize={120} />
        </div>
    </section>
  )
}

export default Particle