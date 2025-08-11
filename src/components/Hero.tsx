import { useScroll } from '../hooks/useScroll';
import Background from './Background';
import HeroContent from './HeroContent';

// Main Hero component
function Hero(): JSX.Element {
  const { scrollY, mounted } = useScroll();
  const parallaxValue = scrollY * 0.4;

  if (!mounted) {
    return (
      <div className="relative w-full h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden bg-black">
        <Background parallaxValue={0} />
        <HeroContent />
      </div>
    );
  }

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden bg-black -mx-4">
      <Background parallaxValue={parallaxValue} />
      <HeroContent />
    </div>
  );
}

export default Hero;