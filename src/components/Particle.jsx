import ParticleText from "./ParticleText";

const Particle = () => {
  return (
    <section className="relative w-screen min-h-50vh bg-white">
        <div className="absolute inset-0 bg-white pt-12">
          <h1 className="text-center bg-white text-4xl">CONTACT</h1>
            <ParticleText text="MAJEED" fontSize={120} />
        </div>
    </section>
  )
}

export default Particle