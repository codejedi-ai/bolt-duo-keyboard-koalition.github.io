import { Link } from 'react-router-dom';

// Render Hero content
function HeroContent() {
  return (
    <div className="relative z-20 h-full w-full px-4 flex flex-col justify-center items-center">
      <div className="flex flex-col items-center text-center animate-fade-in-up">
        <h1 className="flex flex-col lg:flex-row items-center text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 tracking-tight">
          {/* Logo */}
          <img
            src="/images/dkk-logo-removebg-preview.png"
            alt="DKK Logo"
            className="w-32 h-32 md:w-48 md:h-48 lg:w-52 lg:h-52 mb-4 lg:mb-0"
          />
          <div className="lg:ml-6">
            <span className="text-primary">DUO KEYBOARD </span>
            <span className="text-white">KOALITION</span>
          </div>
        </h1>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/projects"
            className="px-8 py-4 text-lg font-semibold bg-primary text-black rounded-md shadow-md hover:bg-primary/80 transition-all duration-200"
          >
            Explore Projects
          </Link>
          <a
            href="https://discord.gg/6GaWZAawUc"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 text-lg font-semibold border-2 border-primary text-primary rounded-md shadow-md hover:bg-primary/20 transition-all duration-200"
          >
            Join Discord
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-8 h-8 text-primary animate-bounce">
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default HeroContent;