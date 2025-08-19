const Hero = () => {
  return (
    <section
      className="flex overflow-hidden relative flex-col justify-center items-center w-full h-screen min-h-screen"
      style={{
        backgroundImage: "url(https://cpcty.xyz/hero-capacity.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex z-10 flex-col items-center px-6 py-16 text-center">
        <div className="flex relative flex-col items-center px-10 py-16 max-w-2xl rounded-3xl border shadow-xl backdrop-blur-xl bg-white/80 md:px-20 md:py-20 border-white/60">
          <h1
            className="mb-6 text-6xl font-semibold tracking-tight leading-tight text-gray-900 md:text-7xl animate-fade-in-up"
            style={{ letterSpacing: "-0.03em" }}
          >
            Capacity
          </h1>
          <p className="mb-10 max-w-xl text-2xl font-light text-gray-700 delay-200 md:text-3xl animate-fade-in-up">
            Turn any idea into a working web app
          </p>
          <button
            className="px-8 py-4 mt-2 text-lg font-semibold text-white bg-black rounded-full shadow-md transition-all duration-200 hover:bg-gray-900 animate-fade-in-up delay-400"
            onClick={() => {
              window.location.href = "https://capacity.so";
            }}
          >
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
