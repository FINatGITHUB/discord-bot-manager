import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Settings as SettingsIcon, ExternalLink } from "lucide-react";
import type { Server } from "@shared/schema";

function ServerCard({ server }: { server: Server }) {
  return (
    <Card className="hover-elevate">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            {server.icon ? (
              <img src={server.icon} alt={server.name} className="w-12 h-12 rounded-full" />
            ) : (
              <span className="text-lg font-bold text-primary">
                {server.name.substring(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-semibold truncate" data-testid={`text-server-name-${server.id}`}>
              {server.name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                <Users className="w-3 h-3 mr-1" />
                {server.memberCount.toLocaleString()}
              </Badge>
              {server.owner && (
                <Badge variant="outline" className="text-xs">
                  Owner
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex-1" data-testid={`button-configure-${server.id}`}>
            <SettingsIcon className="w-3 h-3 mr-1.5" />
            Configure
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" data-testid={`button-view-${server.id}`}>
            <ExternalLink className="w-3 h-3" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Joined {new Date(server.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </CardContent>
    </Card>
  );
}

function ServerCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 w-8" />
        </div>
        <Skeleton className="h-3 w-24 mt-3" />
      </CardContent>
    </Card>
  );
}

export default function Servers() {
  const { data: servers, isLoading } = useQuery<Server[]>({
    queryKey: ["/api/servers"],
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="heading-servers">Servers</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage servers where your bot is active
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ServerCardSkeleton key={i} />
          ))}
        </div>
      ) : servers && servers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servers.map((server) => (
            <ServerCard key={server.id} server={server} />
          ))}
        </div>
      ) : (
        <Card className="p-12">
          <div className="text-center space-y-3">
            <Server className="w-12 h-12 mx-auto text-muted-foreground/50" />
            <div>
              <h3 className="font-medium">No servers found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your bot is not in any servers yet
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
