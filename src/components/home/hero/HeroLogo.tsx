
interface HeroLogoProps {
  isVisible: boolean;
}

export const HeroLogo = ({ isVisible }: HeroLogoProps) => {
  return (
    <div 
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2c7a4d]/20 text-[#2c7a4d] mb-8 transition-all duration-500 transform ${
        isVisible ? "opacity-100" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="flex items-center gap-1">
        <span className="text-white font-bold">K</span>
        <span className="text-[#2c7a4d]">IC</span>
      </div>
      <span className="text-sm font-medium text-[#fefefe]">Karatina Innovation Club</span>
    </div>
  );
};

export default HeroLogo;
