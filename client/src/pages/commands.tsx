import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Terminal } from "lucide-react";
import { useState } from "react";
import type { Command } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

function CommandRow({ command }: { command: Command }) {
  const { toast } = useToast();
  
  const toggleMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      return apiRequest("PATCH", `/api/commands/${command.id}`, { enabled });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/commands"] });
      toast({
        title: "Command updated",
        description: `${command.name} has been ${command.enabled ? 'disabled' : 'enabled'}`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update command",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="flex items-center gap-4 p-4 border rounded-md hover-elevate" data-testid={`row-command-${command.id}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <span className="font-mono text-sm font-medium truncate" data-testid={`text-command-name-${command.id}`}>
            {command.name}
          </span>
          <Badge variant="secondary" className="text-xs">{command.category}</Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1 truncate">{command.description}</p>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="text-right">
          <p className="text-sm font-medium">{command.usageCount}</p>
          <p className="text-xs text-muted-foreground">uses</p>
        </div>
        <Switch
          checked={command.enabled}
          onCheckedChange={(checked) => toggleMutation.mutate(checked)}
          disabled={toggleMutation.isPending}
          data-testid={`switch-command-${command.id}`}
        />
      </div>
    </div>
  );
}

function CommandRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border rounded-md">
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-12" />
        <Skeleton className="h-6 w-11" />
      </div>
    </div>
  );
}

export default function Commands() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: commands, isLoading } = useQuery<Command[]>({
    queryKey: ["/api/commands"],
  });

  const filteredCommands = commands?.filter((cmd) =>
    cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cmd.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cmd.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = commands ? {
    total: commands.length,
    enabled: commands.filter(c => c.enabled).length,
    disabled: commands.filter(c => !c.enabled).length,
  } : { total: 0, enabled: 0, disabled: 0 };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="heading-commands">Commands</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage and configure bot commands
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Commands</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold" data-testid="stat-total-commands">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Enabled</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-status-online" data-testid="stat-enabled-commands">{stats.enabled}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Disabled</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-muted-foreground" data-testid="stat-disabled-commands">{stats.disabled}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <Input
            type="search"
            placeholder="Search commands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
            data-testid="input-search-commands"
          />
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <CommandRowSkeleton key={i} />
            ))
          ) : filteredCommands && filteredCommands.length > 0 ? (
            filteredCommands.map((command) => (
              <CommandRow key={command.id} command={command} />
            ))
          ) : (
            <div className="text-center py-12">
              <Terminal className="w-12 h-12 mx-auto text-muted-foreground/50" />
              <h3 className="font-medium mt-3">No commands found</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {searchQuery ? "Try a different search term" : "No commands available"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
