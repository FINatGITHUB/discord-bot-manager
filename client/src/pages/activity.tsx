import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Terminal, UserPlus, UserMinus, AlertCircle, MessageSquare } from "lucide-react";
import type { ActivityEvent } from "@shared/schema";

function ActivityItem({ event }: { event: ActivityEvent }) {
  const getIcon = () => {
    switch (event.type) {
      case "command":
        return <Terminal className="w-4 h-4" />;
      case "join":
        return <UserPlus className="w-4 h-4" />;
      case "leave":
        return <UserMinus className="w-4 h-4" />;
      case "error":
        return <AlertCircle className="w-4 h-4" />;
      case "message":
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getColor = () => {
    switch (event.type) {
      case "command":
        return "text-primary";
      case "join":
        return "text-status-online";
      case "leave":
        return "text-status-offline";
      case "error":
        return "text-destructive";
      case "message":
        return "text-muted-foreground";
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex gap-4 p-4 border rounded-md hover-elevate" data-testid={`activity-${event.id}`}>
      <div className={`w-8 h-8 rounded-full bg-card flex items-center justify-center flex-shrink-0 ${getColor()}`}>
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs capitalize">
            {event.type}
          </Badge>
          {event.serverName && (
            <span className="text-xs text-muted-foreground truncate">
              in {event.serverName}
            </span>
          )}
          {event.username && (
            <span className="text-xs text-muted-foreground truncate">
              by {event.username}
            </span>
          )}
        </div>
        <p className="text-sm mt-1" data-testid={`text-activity-description-${event.id}`}>{event.description}</p>
      </div>
      <div className="text-xs text-muted-foreground whitespace-nowrap self-start">
        {formatTime(event.timestamp)}
      </div>
    </div>
  );
}

function ActivityItemSkeleton() {
  return (
    <div className="flex gap-4 p-4 border rounded-md">
      <Skeleton className="w-8 h-8 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
      <Skeleton className="h-4 w-16" />
    </div>
  );
}

export default function Activity() {
  const { data: events, isLoading } = useQuery<ActivityEvent[]>({
    queryKey: ["/api/activity"],
    refetchInterval: 5000,
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="heading-activity">Activity Log</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Recent bot events and interactions
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          Auto-refreshing
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Recent Events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <ActivityItemSkeleton key={i} />
            ))
          ) : events && events.length > 0 ? (
            events.map((event) => (
              <ActivityItem key={event.id} event={event} />
            ))
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/50" />
              <h3 className="font-medium mt-3">No activity yet</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Bot events will appear here as they happen
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
