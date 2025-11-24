import { z } from "zod";

export const botStatusSchema = z.object({
  id: z.string(),
  username: z.string(),
  discriminator: z.string(),
  avatar: z.string().nullable(),
  status: z.enum(["online", "offline", "idle", "dnd"]),
  uptime: z.number(),
  lastRestart: z.string(),
  totalServers: z.number(),
  totalUsers: z.number(),
  commandsToday: z.number(),
  activeChannels: z.number(),
});

export const serverSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string().nullable(),
  memberCount: z.number(),
  joinedAt: z.string(),
  owner: z.boolean(),
});

export const channelSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["text", "voice", "category", "announcement"]),
  permissions: z.object({
    canRead: z.boolean(),
    canWrite: z.boolean(),
    canManage: z.boolean(),
  }),
});

export const commandSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  usageCount: z.number(),
  enabled: z.boolean(),
});

export const activityEventSchema = z.object({
  id: z.string(),
  type: z.enum(["command", "join", "leave", "error", "message"]),
  description: z.string(),
  timestamp: z.string(),
  serverId: z.string().optional(),
  serverName: z.string().optional(),
  userId: z.string().optional(),
  username: z.string().optional(),
});

export const botSettingsSchema = z.object({
  prefix: z.string(),
  statusMessage: z.string(),
  activityType: z.enum(["PLAYING", "STREAMING", "LISTENING", "WATCHING", "COMPETING"]),
});

export const insertCommandSchema = commandSchema.omit({ id: true, usageCount: true });
export const insertActivityEventSchema = activityEventSchema.omit({ id: true });
export const insertBotSettingsSchema = botSettingsSchema;

export type BotStatus = z.infer<typeof botStatusSchema>;
export type Server = z.infer<typeof serverSchema>;
export type Channel = z.infer<typeof channelSchema>;
export type Command = z.infer<typeof commandSchema>;
export type ActivityEvent = z.infer<typeof activityEventSchema>;
export type BotSettings = z.infer<typeof botSettingsSchema>;
export type InsertCommand = z.infer<typeof insertCommandSchema>;
export type InsertActivityEvent = z.infer<typeof insertActivityEventSchema>;
export type InsertBotSettings = z.infer<typeof insertBotSettingsSchema>;
