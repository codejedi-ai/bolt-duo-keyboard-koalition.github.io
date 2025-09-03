// Discord OAuth configuration and utilities
const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;
const DISCORD_REDIRECT_URI = `${window.location.origin}/auth/discord/callback`;

export interface DiscordUser {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  discriminator: string;
}

export class DiscordAuth {
  static getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      redirect_uri: DISCORD_REDIRECT_URI,
      response_type: 'code',
      scope: 'identify email',
      state: crypto.randomUUID() // CSRF protection
    });

    return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
  }

  static async exchangeCodeForToken(code: string): Promise<string | null> {
    try {
      const response = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: DISCORD_CLIENT_ID,
          client_secret: import.meta.env.VITE_DISCORD_CLIENT_SECRET,
          grant_type: 'authorization_code',
          code,
          redirect_uri: DISCORD_REDIRECT_URI,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to exchange code for token');
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      return null;
    }
  }

  static async getDiscordUser(accessToken: string): Promise<DiscordUser | null> {
    try {
      const response = await fetch('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Discord user');
      }

      const userData = await response.json();
      
      return {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        avatar: userData.avatar 
          ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
          : null,
        discriminator: userData.discriminator
      };
    } catch (error) {
      console.error('Error fetching Discord user:', error);
      return null;
    }
  }
}