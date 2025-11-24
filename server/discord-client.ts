import { Client, GatewayIntentBits } from 'discord.js';

export async function getUncachableDiscordClient() {
  const botToken = process.env.DISCORD_BOT_TOKEN;

  if (!botToken) {
    throw new Error('DISCORD_BOT_TOKEN not found in environment variables');
  }

  console.log('Attempting to connect to Discord...');

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMembers,
    ]
  });

  try {
    await client.login(botToken);
    console.log('Discord login initiated, waiting for ready event...');
  } catch (error) {
    console.error('Discord login failed:', error);
    throw error;
  }
  
  return new Promise<Client>((resolve, reject) => {
    client.once('ready', () => {
      console.log(`Discord bot connected successfully as ${client.user?.tag}`);
      resolve(client);
    });
    
    client.once('error', (error) => {
      console.error('Discord client error:', error);
      reject(error);
    });
    
    setTimeout(() => {
      console.error('Discord connection timeout after 10 seconds');
      reject(new Error('Discord client connection timeout'));
    }, 10000);
  });
}
