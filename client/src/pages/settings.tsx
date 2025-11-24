import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { BotSettings } from "@shared/schema";
import { botSettingsSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const { data: settings, isLoading } = useQuery<BotSettings>({
    queryKey: ["/api/settings"],
  });

  const form = useForm<BotSettings>({
    resolver: zodResolver(botSettingsSchema),
    defaultValues: settings || {
      prefix: "!",
      statusMessage: "Use !help for commands",
      activityType: "PLAYING",
    },
    values: settings,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: BotSettings) => {
      return apiRequest("PUT", "/api/settings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Settings saved",
        description: "Your bot configuration has been updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BotSettings) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-32" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="heading-settings">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure your bot's behavior and appearance
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Bot Configuration</CardTitle>
              <CardDescription>
                Customize how your bot appears and responds to commands
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="prefix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Command Prefix</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="!"
                        {...field}
                        className="max-w-xs"
                        data-testid="input-prefix"
                      />
                    </FormControl>
                    <FormDescription>
                      The character(s) users type before commands
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="statusMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status Message</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Use !help for commands"
                        {...field}
                        data-testid="input-status-message"
                      />
                    </FormControl>
                    <FormDescription>
                      The message displayed in your bot's status
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="activityType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activity Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="max-w-xs" data-testid="select-activity-type">
                          <SelectValue placeholder="Select activity type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PLAYING">Playing</SelectItem>
                        <SelectItem value="STREAMING">Streaming</SelectItem>
                        <SelectItem value="LISTENING">Listening to</SelectItem>
                        <SelectItem value="WATCHING">Watching</SelectItem>
                        <SelectItem value="COMPETING">Competing in</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How your status message is displayed
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  data-testid="button-save-settings"
                >
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  disabled={updateMutation.isPending}
                  data-testid="button-reset-settings"
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
