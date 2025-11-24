import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Server, Users, Terminal, Radio } from "lucide-react";
import type { BotStatus } from "@shared/schema";

function StatCard({ title, value, icon: Icon, trend }: { title: string; value: string | number; icon: any; trend?: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold" data-testid={`stat-${title.toLowerCase().replace(/\s+/g, '-')}`}>{value}</div>
        {trend && <p className="text-xs text-muted-foreground mt-1">{trend}</p>}
      </CardContent>
    </Card>
  );
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16" />
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { data: botStatus, isLoading } = useQuery<BotStatus>({
    queryKey: ["/api/bot/status"],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-status-online";
      case "idle":
        return "bg-status-away";
      case "dnd":
        return "bg-status-busy";
      default:
        return "bg-status-offline";
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="heading-dashboard">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Monitor your bot's performance and activity</p>
      </div>

      {isLoading ? (
        <>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="w-16 h-16 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
        </>
      ) : botStatus ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Bot Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {botStatus.username.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-4 border-card ${getStatusColor(botStatus.status)}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold truncate" data-testid="text-bot-name">
                    {botStatus.username}#{botStatus.discriminator}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs capitalize">
                      {botStatus.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">ID: {botStatus.id}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Uptime</p>
                  <p className="text-lg font-semibold" data-testid="text-uptime">
                    {formatUptime(botStatus.uptime)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Last Restart</p>
                  <p className="text-lg font-semibold" data-testid="text-last-restart">
                    {formatDate(botStatus.lastRestart)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Servers"
              value={botStatus.totalServers}
              icon={Server}
              trend="Across all regions"
            />
            <StatCard
              title="Total Users"
              value={botStatus.totalUsers.toLocaleString()}
              icon={Users}
              trend="Active members"
            />
            <StatCard
              title="Commands Today"
              value={botStatus.commandsToday}
              icon={Terminal}
              trend="Last 24 hours"
            />
            <StatCard
              title="Active Channels"
              value={botStatus.activeChannels}
              icon={Radio}
              trend="Currently monitored"
            />
          </div>
        </>
      ) : (
        <Card className="p-12">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">Unable to load bot status</p>
          </div>
        </Card>
      )}
    </div>
  );
}
