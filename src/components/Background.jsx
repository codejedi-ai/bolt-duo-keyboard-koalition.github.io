// Render background elements
function Background({ parallaxValue }) {
  return (
    <>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black z-10"></div>

      {/* Parallax effect */}
      <div
        className="absolute inset-0 z-0 transition-transform duration-100 ease-out"
        style={{ transform: `translateY(${parallaxValue}px)` }}
      >
        <img
          src="https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          alt="Background"
          className="w-full h-full object-cover"
          style={{
            filter: "brightness(0.7)",
          }}
        />
      </div>
    </>
  );
}

export default Background;