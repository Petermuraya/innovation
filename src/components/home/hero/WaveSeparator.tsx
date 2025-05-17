
interface WaveSeparatorProps {
  scrollY: number;
}

export const WaveSeparator = ({ scrollY }: WaveSeparatorProps) => {
  return (
    <div 
      className="absolute bottom-0 left-0 w-full"
      style={{ transform: `translateY(${scrollY * 0.1}px)` }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="text-[#194d30]">
        <path fill="currentColor" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,208C384,192,480,192,576,197.3C672,203,768,213,864,229.3C960,245,1056,267,1152,266.7C1248,267,1344,245,1392,234.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>
    </div>
  );
};

export default WaveSeparator;
