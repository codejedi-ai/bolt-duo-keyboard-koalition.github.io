function About(): JSX.Element {
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">About the Duo Keyboard Koalition</h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-gray-300">
            <p>
              The <strong className="text-primary">Duo Keyboard Koalition</strong> is a community of passionate hackers, coders, and tech enthusiasts who come together to collaborate, learn, and take on hackathons with a competitive spirit. Originally formed by a group of people who met at hackathons, the Koalition has evolved into a space where members push each other to innovate, build meaningful projects, and grow their skills.
            </p>
            <p>
              The vibe is part competitive, part collaborative—like a team of modern-day "pirates" setting out on adventures in tech, always ready to tackle the next challenge. Whether you're looking to brainstorm new ideas, work on side projects, or prepare for upcoming hackathons, the Duo Keyboard Koalition is a supportive and driven community where you can connect with like-minded people and bring exciting ideas to life.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              src="/images/logo_ngb.png"
              alt="DKK Logo"
              className="w-64 h-64 object-contain"
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold mb-8 text-center">What We Offer</h3>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="w-12 h-12 text-primary mb-4">
                <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-2 text-white">Hack Together</h4>
              <p className="text-gray-400">Collaborate on innovative projects and push the boundaries of technology.</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="w-12 h-12 text-primary mb-4">
                <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.996 2.996 0 0 0 17.06 7H16c-.8 0-1.54.37-2.01.99L12 10.5 10.01 7.99A2.996 2.996 0 0 0 7.94 7H6.94c-1.09 0-2.09.59-2.6 1.52L2 14h2.5v6h3v-6h2.5l1.5-2.5L13 14h2.5v6h4z"/>
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-2 text-white">Community</h4>
              <p className="text-gray-400">Join a supportive network of like-minded tech enthusiasts.</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="w-12 h-12 text-primary mb-4">
                <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 3V1h2v2h6V1h2v2h4a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4zm0 2H3v16h18V5h-4v2h-2V5H9v2H7V5z"/>
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-2 text-white">Compete</h4>
              <p className="text-gray-400">Participate in hackathons and coding competitions as a team.</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="w-12 h-12 text-primary mb-4">
                <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.81 14.12L5.64 11.29L8.47 14.12L7.06 15.53L3.5 12L7.06 8.47L8.47 9.88L5.64 12.71L2.81 14.12M21.19 9.88L18.36 12.71L15.53 9.88L16.94 8.47L20.5 12L16.94 15.53L15.53 14.12L18.36 11.29L21.19 9.88M9.5 3L14.5 21L12.75 21.5L7.75 3.5L9.5 3Z"/>
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-2 text-white">Grow</h4>
              <p className="text-gray-400">Learn new skills and advance your technical expertise.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;