
export default function StatsSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-innovation-800 to-innovation-950 text-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="font-bold text-white mb-2">Our Impact</h2>
          <p className="text-innovation-100 max-w-2xl mx-auto">
            Building the next generation of tech leaders through community, education and innovation
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">500+</div>
            <p className="text-innovation-200">Active Members</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">50+</div>
            <p className="text-innovation-200">Completed Projects</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">30+</div>
            <p className="text-innovation-200">Events Per Year</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">15+</div>
            <p className="text-innovation-200">Industry Partners</p>
          </div>
        </div>
      </div>
    </section>
  );
}
