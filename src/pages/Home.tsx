import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import Hero from '../components/Hero';
import JoinDiscord from '../components/JoinDiscord';

function Home(): JSX.Element {
  return (
    <SignedOut>
      <>
        <Hero />
        
        {/* Call to Action Section */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">Welcome to the Koalition</h2>
            <p className="text-gray-400 text-lg">
              Join a community that celebrates winners, builds networks, and creates the next generation of champions.
            </p>
          </div>

          <JoinDiscord />
        </section>
      </>
    </SignedOut>
  );
}

export default Home;