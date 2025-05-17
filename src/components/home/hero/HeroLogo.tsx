
interface HeroLogoProps {
  isVisible: boolean;
}

export const HeroLogo = ({ isVisible }: HeroLogoProps) => {
  return (
    <div 
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#b28d49]/20 text-[#b28d49] mb-8 transition-all duration-500 transform ${
        isVisible ? "opacity-100" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="flex items-center gap-1">
        <span className="text-white font-bold">K</span>
        <span className="text-[#b28d49]">IC</span>
      </div>
      <span className="text-sm font-medium text-[#fefefe]">Karatina Innovation Club</span>
    </div>
  );
};

export default HeroLogo;
