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
          <Button 
            variant="outline" 
            className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
            onClick={handleLearnMore}
          >
            Learn More
          </Button>
        </div>
        </div>
      </CardContent>
    </Card>
  )
  )
  )
}

export default JoinDiscord