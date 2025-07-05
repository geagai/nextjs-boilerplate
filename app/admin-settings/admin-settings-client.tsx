"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import React from "react";

interface AdminSettingsRow {
  id?: string
  stripe_publishable_key: string | null
  stripe_secret: string | null
  stripe_webhook_secret: string | null
  show_header: boolean | null
}

interface AdminSettingsClientProps {
  initialSettings: AdminSettingsRow
}

export function AdminSettingsClient({ initialSettings }: AdminSettingsClientProps) {
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<AdminSettingsRow>(initialSettings);
  const supabase = createClient();

  // Debug: check admin status on mount
  React.useEffect(() => {
    async function checkAdminStatus() {
      const { data, error } = await supabase.rpc('is_admin');
      if (error) {
        console.error('is_admin RPC error:', error);
      } else {
        console.log('is_admin RPC result:', data);
      }
    }
    checkAdminStatus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]:
      name === "show_header" ? (value === '' ? null : value === 'true') : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        stripe_publishable_key: settings.stripe_publishable_key,
        stripe_secret: settings.stripe_secret,
        stripe_webhook_secret: settings.stripe_webhook_secret,
        show_header: settings.show_header,
      } as const;

      let error;
      if (settings.id) {
        // Update existing row via upsert using its UUID primary key
        const { error: upsertError } = await supabase
          .from("admin_settings")
          .upsert({ id: settings.id, ...payload });
        error = upsertError;
      } else {
        // Insert new row; UUID will be generated automatically
        const { error: insertError, data } = await supabase
          .from("admin_settings")
          .insert(payload)
          .select()
          .single();
        if (!insertError && data?.id) {
          setSettings((prev) => ({ ...prev, id: data.id }));
        }
        error = insertError;
      }

      if (error) throw error;
      toast({ title: "Settings saved" });
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to save settings", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div>
          <h1 className="text-3xl font-bold">Admin Settings</h1>
          <p className="text-muted-foreground mt-2">Manage global configuration and integrations.</p>
        </div>

        <div className="space-y-8 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <SettingsIcon className="h-5 w-5 mr-2 text-primary" />
                Stripe & UI Configuration
              </CardTitle>
              <CardDescription>
                Update your Stripe keys and header visibility preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Stripe Publishable Key */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Stripe Publishable Key</label>
                    <Input
                      name="stripe_publishable_key"
                      placeholder="pk_live_..."
                      value={settings.stripe_publishable_key || ""}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Stripe Secret Key */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Stripe Secret Key</label>
                    <Input
                      name="stripe_secret"
                      type="password"
                      placeholder="sk_live_..."
                      value={settings.stripe_secret || ""}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Stripe Webhook Secret */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Stripe Webhook Secret</label>
                    <Input
                      name="stripe_webhook_secret"
                      type="password"
                      placeholder="whsec_..."
                      value={settings.stripe_webhook_secret || ""}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Header Visibility */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Show Header?</label>
                    <select
                      name="show_header"
                      className="border rounded px-2 py-2 w-full bg-background"
                      value={settings.show_header === null ? "" : settings.show_header ? "true" : "false"}
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        Select...
                      </option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Settings"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 