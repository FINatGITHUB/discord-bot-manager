import { randomUUID } from "crypto";
import type {
  BotStatus,
  Server,
  Channel,
  Command,
  ActivityEvent,
  BotSettings,
  InsertCommand,
  InsertActivityEvent,
  InsertBotSettings,
} from "@shared/schema";

export interface IStorage {
  getBotStatus(): Promise<BotStatus | undefined>;
  setBotStatus(status: BotStatus): Promise<void>;
  
  getServers(): Promise<Server[]>;
  setServers(servers: Server[]): Promise<void>;
  
  getServerChannels(serverId: string): Promise<Channel[]>;
  setServerChannels(serverId: string, channels: Channel[]): Promise<void>;
  
  getCommands(): Promise<Command[]>;
  getCommand(id: string): Promise<Command | undefined>;
  updateCommand(id: string, updates: Partial<Command>): Promise<Command | undefined>;
  setCommands(commands: Command[]): Promise<void>;
  
  getActivityEvents(): Promise<ActivityEvent[]>;
  addActivityEvent(event: InsertActivityEvent): Promise<ActivityEvent>;
  
  getSettings(): Promise<BotSettings>;
  updateSettings(settings: InsertBotSettings): Promise<BotSettings>;
}

export class MemStorage implements IStorage {
  private botStatus: BotStatus | undefined;
  private servers: Server[] = [];
  private serverChannels: Map<string, Channel[]> = new Map();
  private commands: Map<string, Command> = new Map();
  private activityEvents: ActivityEvent[] = [];
  private settings: BotSettings;
  private botStartTime: number;

  constructor() {
    this.botStartTime = Date.now();
    this.settings = {
      prefix: "!",
      statusMessage: "Use !help for commands",
      activityType: "PLAYING",
    };
    
    this.initializeDefaultCommands();
  }

  private initializeDefaultCommands() {
    const defaultCommands: Command[] = [
      {
        id: randomUUID(),
        name: "help",
        description: "Shows all available commands",
        category: "Utility",
        usageCount: 127,
        enabled: true,
      },
      {
        id: randomUUID(),
        name: "ping",
        description: "Check bot latency and response time",
        category: "Utility",
        usageCount: 89,
        enabled: true,
      },
      {
        id: randomUUID(),
        name: "userinfo",
        description: "Display information about a user",
        category: "Info",
        usageCount: 56,
        enabled: true,
      },
      {
        id: randomUUID(),
        name: "serverinfo",
        description: "Display information about the server",
        category: "Info",
        usageCount: 43,
        enabled: true,
      },
      {
        id: randomUUID(),
        name: "kick",
        description: "Kick a member from the server",
        category: "Moderation",
        usageCount: 12,
        enabled: true,
      },
      {
        id: randomUUID(),
        name: "ban",
        description: "Ban a member from the server",
        category: "Moderation",
        usageCount: 8,
        enabled: false,
      },
      {
        id: randomUUID(),
        name: "clear",
        description: "Clear messages from a channel",
        category: "Moderation",
        usageCount: 34,
        enabled: true,
      },
      {
        id: randomUUID(),
        name: "poll",
        description: "Create a poll with reactions",
        category: "Fun",
        usageCount: 67,
        enabled: true,
      },
      {
        id: randomUUID(),
        name: "meme",
        description: "Get a random meme",
        category: "Fun",
        usageCount: 145,
        enabled: true,
      },
    ];

    defaultCommands.forEach((cmd) => this.commands.set(cmd.id, cmd));
  }

  async getBotStatus(): Promise<BotStatus | undefined> {
    if (this.botStatus) {
      const uptime = Math.floor((Date.now() - this.botStartTime) / 1000);
      return { ...this.botStatus, uptime };
    }
    return this.botStatus;
  }

  async setBotStatus(status: BotStatus): Promise<void> {
    this.botStatus = status;
  }

  async getServers(): Promise<Server[]> {
    return this.servers;
  }

  async setServers(servers: Server[]): Promise<void> {
    this.servers = servers;
  }

  async getServerChannels(serverId: string): Promise<Channel[]> {
    return this.serverChannels.get(serverId) || [];
  }

  async setServerChannels(serverId: string, channels: Channel[]): Promise<void> {
    this.serverChannels.set(serverId, channels);
  }

  async getCommands(): Promise<Command[]> {
    return Array.from(this.commands.values());
  }

  async getCommand(id: string): Promise<Command | undefined> {
    return this.commands.get(id);
  }

  async updateCommand(id: string, updates: Partial<Command>): Promise<Command | undefined> {
    const command = this.commands.get(id);
    if (!command) return undefined;
    
    const updated = { ...command, ...updates };
    this.commands.set(id, updated);
    return updated;
  }

  async setCommands(commands: Command[]): Promise<void> {
    this.commands.clear();
    commands.forEach((cmd) => this.commands.set(cmd.id, cmd));
  }

  async getActivityEvents(): Promise<ActivityEvent[]> {
    return this.activityEvents.slice().reverse().slice(0, 50);
  }

  async addActivityEvent(event: InsertActivityEvent): Promise<ActivityEvent> {
    const newEvent: ActivityEvent = {
      ...event,
      id: randomUUID(),
    };
    this.activityEvents.push(newEvent);
    
    if (this.activityEvents.length > 100) {
      this.activityEvents = this.activityEvents.slice(-100);
    }
    
    return newEvent;
  }

  async getSettings(): Promise<BotSettings> {
    return this.settings;
  }

  async updateSettings(settings: InsertBotSettings): Promise<BotSettings> {
    this.settings = settings;
    return this.settings;
  }
}

export const storage = new MemStorage();
