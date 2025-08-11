import { DiscIcon as DiscordLogo } from 'lucide-react'
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"

function JoinDiscord() {
  const discordInviteLink = "https://discord.com/invite/6GaWZAawUc"
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(discordInviteLink)}`

  const handleLearnMore = () => {
    alert("To learn more, please join our Discord community!")
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">Join Our Community</h2>
          <p className="text-gray-400 mb-6">
            Ready to join a community of innovators? Whether you're a seasoned developer or just starting out, there's a place for you in the Koalition.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
            <Button asChild>
              <a
                href={discordInviteLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#5865F2] hover:bg-[#4752C4] text-white flex items-center gap-2"
              >
                <DiscordLogo className="w-5 h-5" />
                Join Discord
              </a>
            </Button>
            <div className="flex items-center gap-3">
              <img 
                src={qrCodeUrl} 
                alt="Discord QR Code" 
                className="w-16 h-16 bg-white p-1 rounded"
              />
              <span className="text-xs text-gray-500">Scan to join</span>
            </div>
            <Button 
              variant="outline" 
              className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
              onClick={handleLearnMore}
            >
              Learn More
            </Button>
          </div>
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
            >
              <a
                href="https://www.linkedin.com/company/pygmalion-koalition/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default JoinDiscord