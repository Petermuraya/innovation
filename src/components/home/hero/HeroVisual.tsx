
import InnovationCube from "../InnovationCube";

interface HeroVisualProps {
  isVisible: boolean;
}

export const HeroVisual = ({ isVisible }: HeroVisualProps) => {
  return (
    <div 
      className={`lg:col-span-7 z-10 transition-all duration-700 delay-500 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      <div className="relative rounded-xl overflow-hidden border border-[#b28d49]/30 shadow-2xl">
        {/* Main visual with innovative glass panels */}
        <div className="relative aspect-[16/9] md:aspect-[16/10] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 overflow-hidden">
          {/* Futuristic figure silhouette */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
              alt="Innovation figure"
              className="object-cover w-full h-full opacity-60"
            />
          </div>
          
          {/* Dynamic glowing lines */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M100,50 Q200,150 300,100 T500,100" stroke="#b28d49" strokeWidth="2" fill="none" className="animate-float-slow" />
            <path d="M50,200 Q150,50 250,200 T450,200" stroke="#ffffff" strokeWidth="1" strokeDasharray="5,5" fill="none" className="animate-float-medium" />
            <path d="M200,400 Q300,200 400,400" stroke="#b28d49" strokeWidth="1.5" fill="none" className="animate-float-fast" />
          </svg>
          
          {/* Floating glass panels */}
          <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 rotate-6 animate-float-medium">
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-lg border border-[#b28d49]/30 w-36 h-24">
              <p className="text-[#fefefe] text-xs font-medium mb-1">Prototype Tests</p>
              <div className="h-10 flex items-end gap-1">
                {[1, 4, 2, 6, 3, 5, 7].map((h, i) => (
                  <div 
                    key={i}
                    className="w-2 bg-gradient-to-t from-[#b28d49] to-[#ffffff]" 
                    style={{ height: `${h * 10}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-1/3 right-1/4 transform translate-x-1/2 translate-y-1/2 -rotate-3 animate-float-slow">
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-lg border border-[#b28d49]/30 w-36 h-24">
              <p className="text-[#fefefe] text-xs font-medium mb-1">Innovation Metrics</p>
              <svg className="h-10 w-full" viewBox="0 0 100 20">
                <path d="M0,10 Q10,5 20,10 T40,15 T60,5 T80,10 T100,5" stroke="#b28d49" strokeWidth="1" fill="none" />
              </svg>
            </div>
          </div>
          
          {/* Interactive innovation cube overlay */}
          <div className="absolute -right-10 -top-10 z-20 opacity-80 hover:opacity-100 transition-opacity hidden lg:block scale-75">
            <InnovationCube />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroVisual;
