import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getUncachableDiscordClient } from "./discord-client";
import type { BotStatus, Server as DiscordServer, Channel, ActivityEvent } from "@shared/schema";
import { botSettingsSchema } from "@shared/schema";
import { ChannelType } from "discord.js";

export async function registerRoutes(app: Express): Promise<Server> {
  let discordReady = false;
  let initError: string | null = null;

  async function initializeDiscordData() {
    try {
      const client = await getUncachableDiscordClient();
      
      if (!client.user) {
        throw new Error("Discord client user not available");
      }

      const botStatus: BotStatus = {
        id: client.user.id,
        username: client.user.username,
        discriminator: client.user.discriminator,
        avatar: client.user.avatar,
        status: "online",
        uptime: 0,
        lastRestart: new Date().toISOString(),
        totalServers: client.guilds.cache.size,
        totalUsers: client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0),
        commandsToday: 0,
        activeChannels: client.guilds.cache.reduce((acc, guild) => {
          return acc + guild.channels.cache.filter(ch => ch.isTextBased()).size;
        }, 0),
      };

      await storage.setBotStatus(botStatus);

      const servers: DiscordServer[] = Array.from(client.guilds.cache.values()).map((guild) => ({
        id: guild.id,
        name: guild.name,
        icon: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : null,
        memberCount: guild.memberCount,
        joinedAt: guild.joinedAt.toISOString(),
        owner: guild.ownerId === client.user?.id,
      }));

      await storage.setServers(servers);

      for (const guild of Array.from(client.guilds.cache.values())) {
        const channels: Channel[] = Array.from(guild.channels.cache.values())
          .filter((ch: any) => ch.type === ChannelType.GuildText || 
                         ch.type === ChannelType.GuildVoice ||
                         ch.type === ChannelType.GuildCategory ||
                         ch.type === ChannelType.GuildAnnouncement)
          .map((ch: any) => {
            const channelTypeMap: { [key: number]: "text" | "voice" | "category" | "announcement" } = {
              [ChannelType.GuildText]: "text",
              [ChannelType.GuildVoice]: "voice",
              [ChannelType.GuildCategory]: "category",
              [ChannelType.GuildAnnouncement]: "announcement",
            };

            return {
              id: ch.id,
              name: ch.name,
              type: channelTypeMap[ch.type] || "text",
              permissions: {
                canRead: true,
                canWrite: true,
                canManage: false,
              },
            };
          });

        await storage.setServerChannels(guild.id, channels);
      }

      await storage.addActivityEvent({
        type: "message",
        description: "Bot successfully connected to Discord",
        timestamp: new Date().toISOString(),
      });

      discordReady = true;
      
      await client.destroy();
    } catch (error) {
      console.error("Discord connection unavailable, using demo data:", error);
      initError = error instanceof Error ? error.message : "Unknown error";
      discordReady = false;
      
      await initializeDemoData();
    }
  }

  async function initializeDemoData() {
    const demoStatus: BotStatus = {
      id: "123456789012345678",
      username: "MyDiscordBot",
      discriminator: "0001",
      avatar: null,
      status: "online",
      uptime: 0,
      lastRestart: new Date().toISOString(),
      totalServers: 5,
      totalUsers: 1247,
      commandsToday: 342,
      activeChannels: 23,
    };

    await storage.setBotStatus(demoStatus);

    const demoServers: DiscordServer[] = [
      {
        id: "1",
        name: "Gaming Community",
        icon: null,
        memberCount: 523,
        joinedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        owner: false,
      },
      {
        id: "2",
        name: "Developer Hub",
        icon: null,
        memberCount: 187,
        joinedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        owner: true,
      },
      {
        id: "3",
        name: "Music Lovers",
        icon: null,
        memberCount: 342,
        joinedAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
        owner: false,
      },
      {
        id: "4",
        name: "Study Group",
        icon: null,
        memberCount: 95,
        joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        owner: false,
      },
      {
        id: "5",
        name: "Art & Design",
        icon: null,
        memberCount: 100,
        joinedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        owner: false,
      },
    ];

    await storage.setServers(demoServers);

    const demoChannels: Channel[] = [
      {
        id: "ch1",
        name: "general",
        type: "text",
        permissions: { canRead: true, canWrite: true, canManage: false },
      },
      {
        id: "ch2",
        name: "announcements",
        type: "announcement",
        permissions: { canRead: true, canWrite: false, canManage: false },
      },
      {
        id: "ch3",
        name: "voice-chat",
        type: "voice",
        permissions: { canRead: true, canWrite: true, canManage: false },
      },
    ];

    for (const server of demoServers) {
      await storage.setServerChannels(server.id, demoChannels);
    }

    const demoEvents: Array<{ type: ActivityEvent['type']; description: string; timestamp: string }> = [
      { type: "command", description: "User @alex used command !help in Gaming Community", timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
      { type: "join", description: "Bot joined server 'New Server'", timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
      { type: "command", description: "User @sarah used command !ping in Developer Hub", timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString() },
      { type: "message", description: "Bot status updated successfully", timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
      { type: "command", description: "User @mike used command !serverinfo in Music Lovers", timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString() },
      { type: "command", description: "User @emma used command !poll in Gaming Community", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
      { type: "leave", description: "Bot left server 'Inactive Server'", timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
      { type: "command", description: "User @john used command !meme in Developer Hub", timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },
    ];

    for (const event of demoEvents) {
      await storage.addActivityEvent(event);
    }

    await storage.addActivityEvent({
      type: "message",
      description: "Running in demo mode - Connect your Discord bot for live data",
      timestamp: new Date().toISOString(),
    });
  }

  initializeDiscordData();

  app.get("/api/bot/status", async (_req, res) => {
    try {
      const status = await storage.getBotStatus();
      if (!status) {
        return res.status(503).json({ error: "Bot status not available yet" });
      }
      res.json(status);
    } catch (error) {
      console.error("Error fetching bot status:", error);
      res.status(500).json({ error: "Failed to fetch bot status" });
    }
  });

  app.get("/api/servers", async (_req, res) => {
    try {
      const servers = await storage.getServers();
      res.json(servers);
    } catch (error) {
      console.error("Error fetching servers:", error);
      res.status(500).json({ error: "Failed to fetch servers" });
    }
  });

  app.get("/api/servers/:id/channels", async (req, res) => {
    try {
      const { id } = req.params;
      const channels = await storage.getServerChannels(id);
      res.json(channels);
    } catch (error) {
      console.error("Error fetching channels:", error);
      res.status(500).json({ error: "Failed to fetch channels" });
    }
  });

  app.get("/api/commands", async (_req, res) => {
    try {
      const commands = await storage.getCommands();
      res.json(commands);
    } catch (error) {
      console.error("Error fetching commands:", error);
      res.status(500).json({ error: "Failed to fetch commands" });
    }
  });

  app.patch("/api/commands/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { enabled } = req.body;

      if (typeof enabled !== "boolean") {
        return res.status(400).json({ error: "enabled must be a boolean" });
      }

      const updated = await storage.updateCommand(id, { enabled });
      
      if (!updated) {
        return res.status(404).json({ error: "Command not found" });
      }

      await storage.addActivityEvent({
        type: "command",
        description: `Command "${updated.name}" ${enabled ? 'enabled' : 'disabled'}`,
        timestamp: new Date().toISOString(),
      });

      res.json(updated);
    } catch (error) {
      console.error("Error updating command:", error);
      res.status(500).json({ error: "Failed to update command" });
    }
  });

  app.get("/api/activity", async (_req, res) => {
    try {
      const events = await storage.getActivityEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching activity:", error);
      res.status(500).json({ error: "Failed to fetch activity" });
    }
  });

  app.get("/api/settings", async (_req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.put("/api/settings", async (req, res) => {
    try {
      const validatedSettings = botSettingsSchema.parse(req.body);
      const updated = await storage.updateSettings(validatedSettings);

      await storage.addActivityEvent({
        type: "command",
        description: `Bot settings updated: prefix="${updated.prefix}", activity="${updated.activityType}"`,
        timestamp: new Date().toISOString(),
      });

      res.json(updated);
    } catch (error) {
      console.error("Error updating settings:", error);
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid settings data" });
      }
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
