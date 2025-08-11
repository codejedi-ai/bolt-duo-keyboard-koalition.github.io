import { useState, useEffect } from 'react';
import { useUser, SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import Hero from '../components/Hero'
import { Code2, Users, Trophy, Rocket } from 'lucide-react'
import { Card, CardContent } from "../components/ui/card"
import JoinDiscord from '../components/JoinDiscord'

function Home() {
  const { isSignedIn, user } = useUser();

  return (
    <>
      {/* Dashboard view for authenticated users */}
      <SignedIn>
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Welcome back, <span className="text-primary">{user?.firstName || 'Koalition Member'}</span>!
              </h1>
              <p className="text-gray-400 text-lg">
                Ready to hack, code, and innovate with the Koalition today?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <Card className="bg-gray-900 border-gray-800 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <Code2 className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-white">Active Projects</h3>
                  <p className="text-gray-400 mb-4">Continue working on your latest innovations and collaborations.</p>
                  <a href="/projects" className="text-primary hover:text-primary/80 font-medium">
                    View Projects →
                  </a>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <Users className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-white">Upcoming Events</h3>
                  <p className="text-gray-400 mb-4">Join your next coding session, hackathon, or community meetup.</p>
                  <a href="/events" className="text-primary hover:text-primary/80 font-medium">
                    View Calendar →
                  </a>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <Trophy className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-white">Community Hub</h3>
                  <p className="text-gray-400 mb-4">Connect with fellow hackers and share your latest achievements.</p>
                  <button 
                    onClick={() => window.open('https://discord.gg/6GaWZAawUc', '_blank')}
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    Join Discord →
                  </button>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-white">Quick Actions</h3>
                  <div className="space-y-3">
                    <a 
                      href="/events" 
                      className="block p-3 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center">
                        <Users className="w-5 h-5 text-primary mr-3" />
                        <span className="text-white">Browse Events</span>
                      </div>
                    </a>
                    <a 
                      href="/projects" 
                      className="block p-3 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center">
                        <Code2 className="w-5 h-5 text-primary mr-3" />
                        <span className="text-white">Explore Projects</span>
                      </div>
                    </a>
                    <button 
                      onClick={() => window.open('https://discord.gg/6GaWZAawUc', '_blank')}
                      className="block w-full p-3 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors text-left"
                    >
                      <div className="flex items-center">
                        <Rocket className="w-5 h-5 text-primary mr-3" />
                        <span className="text-white">Join Discord Community</span>
                      </div>
                    </button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-white">Latest Updates</h3>
                  <div className="space-y-4">
                    <div className="border-l-4 border-primary pl-4">
                      <h4 className="font-semibold text-white">New Hackathon Season</h4>
                      <p className="text-gray-400 text-sm">Get ready for upcoming hackathons and coding competitions.</p>
                    </div>
                    <div className="border-l-4 border-gray-600 pl-4">
                      <h4 className="font-semibold text-white">Community Growth</h4>
                      <p className="text-gray-400 text-sm">Welcome new members to the Koalition family!</p>
                    </div>
                    <div className="border-l-4 border-gray-600 pl-4">
                      <h4 className="font-semibold text-white">Project Showcases</h4>
                      <p className="text-gray-400 text-sm">Check out the amazing projects our members have built.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </SignedIn>

      {/* Public home page for non-authenticated users */}
      <SignedOut>
        <>
        <Hero />
        <section className="mb-16 px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">Welcome to the Koalition</h2>
            <p className="text-gray-400 text-lg">
              The Duo Keyboard Koalition is a community of passionate hackers, coders, and tech enthusiasts who come together to collaborate, learn, and take on hackathons with a competitive spirit.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <Code2 className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2 text-white">Hack Together</h3>
                <p className="text-gray-400">Collaborate on innovative projects and push the boundaries of technology.</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <Users className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2 text-white">Community</h3>
                <p className="text-gray-400">Join a supportive network of like-minded tech enthusiasts.</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <Trophy className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2 text-white">Compete</h3>
                <p className="text-gray-400">Participate in hackathons and coding competitions as a team.</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <Rocket className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2 text-white">Grow</h3>
                <p className="text-gray-400">Learn new skills and advance your technical expertise.</p>
              </CardContent>
            </Card>
          </div>

          <JoinDiscord />
        </section>
        </>
      </SignedOut>
    </>
  )
}

export default Home