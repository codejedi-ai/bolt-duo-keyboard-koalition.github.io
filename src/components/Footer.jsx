function Footer({ handleDiscordJoin }) {
  return (
    <footer className="bg-gray-900 py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-PjQ7yXSb2U4BqTmLgAhrHSc15WVDmA.png"
              alt="DKK Logo"
              className="w-8 h-8 mr-2"
            />
            <span className="text-gray-400 text-sm">© 2024 Duo Keyboard Koalition</span>
          </div>
          <div className="flex gap-4">
            <button 
              className="text-gray-400 hover:text-[#5865F2] text-sm"
              onClick={handleDiscordJoin}
            >
              Discord
            </button>
            <a 
              href="https://github.com/orgs/Duo-Keyboard-Koalition/repositories" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-primary text-sm"
            >
              GitHub
            </a>
            <a 
              href="https://dorahacks.io/org/2861" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-primary text-sm"
            >
              DoraHacks
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;