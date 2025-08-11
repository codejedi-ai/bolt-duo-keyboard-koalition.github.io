import Hero from '../components/Hero'
import { Code2, Users, Trophy, Rocket } from 'lucide-react'
import { Card, CardContent } from "../components/ui/card"
import JoinDiscord from '../components/JoinDiscord'

function Home() {
  return (
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

    {/* About Section */}
    <section className="max-w-3xl mx-auto py-16 px-4">
      <h2 className="text-3xl font-bold mb-6">About the Duo Keyboard Koalition</h2>
      <div className="space-y-4 text-gray-300">
        <p>
          The <strong>Duo Keyboard Koalition</strong> is a community of passionate hackers, coders, and tech enthusiasts who come together to collaborate, learn, and take on hackathons with a competitive spirit. Originally formed by a group of people who met at hackathons, the Koalition has evolved into a space where members push each other to innovate, build meaningful projects, and grow their skills.
        </p>
        <p>
          The vibe is part competitive, part collaborative—like a team of modern-day "pirates" setting out on adventures in tech, always ready to tackle the next challenge. Whether you're looking to brainstorm new ideas, work on side projects, or prepare for upcoming hackathons, the Duo Keyboard Koalition is a supportive and driven community where you can connect with like-minded people and bring exciting ideas to life.
        </p>
      </div>
    </section>
    </>
  );
}

export default Home