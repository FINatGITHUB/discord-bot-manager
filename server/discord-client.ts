import { Client, GatewayIntentBits } from 'discord.js';

export async function getUncachableDiscordClient() {
  const botToken = process.env.DISCORD_BOT_TOKEN;

  if (!botToken) {
    throw new Error('DISCORD_BOT_TOKEN not found in environment variables');
  }

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMembers,
    ]
  });

  await client.login(botToken);
  
  return new Promise<Client>((resolve, reject) => {
    client.once('ready', () => {
      resolve(client);
    });
    
    client.once('error', (error) => {
      reject(error);
    });
    
    setTimeout(() => {
      reject(new Error('Discord client connection timeout'));
    }, 10000);
  });
}
