import ParticleText from "./ParticleText";

const Particle = () => {
  return (
    <section className="relative min-h-screen w-screen bg-white pb-52">
        <div className="absolute inset-0">
            <ParticleText text="MAJEED" fontSize={120} />
        </div>
    </section>
  )
}

export default Particle