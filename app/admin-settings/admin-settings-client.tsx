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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AdminSettingsRow {
  id?: string
  stripe_publishable_key: string | null
  stripe_secret: string | null
  stripe_webhook_secret: string | null
  show_header: boolean | null
  primary_color: string | null
  secondary_color: string | null
  background_color: string | null
  headline_text_color: string | null
  paragraph_text_color: string | null
  button_color: string | null
  button_hover_color: string | null
  button_text_color: string | null
  link_color: string | null
  link_hover_color: string | null
  header_background_color: string | null
  dark_primary_color: string | null
  dark_secondary_color: string | null
  dark_background_color: string | null
  dark_headline_text_color: string | null
  dark_paragraph_text_color: string | null
  dark_button_color: string | null
  dark_button_hover_color: string | null
  dark_button_text_color: string | null
  dark_link_color: string | null
  dark_link_hover_color: string | null
  dark_header_background_color: string | null
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
        primary_color: settings.primary_color,
        secondary_color: settings.secondary_color,
        background_color: settings.background_color,
        headline_text_color: settings.headline_text_color,
        paragraph_text_color: settings.paragraph_text_color,
        button_color: settings.button_color,
        button_hover_color: settings.button_hover_color,
        button_text_color: settings.button_text_color,
        link_color: settings.link_color,
        link_hover_color: settings.link_hover_color,
        header_background_color: settings.header_background_color,
        dark_primary_color: settings.dark_primary_color,
        dark_secondary_color: settings.dark_secondary_color,
        dark_background_color: settings.dark_background_color,
        dark_headline_text_color: settings.dark_headline_text_color,
        dark_paragraph_text_color: settings.dark_paragraph_text_color,
        dark_button_color: settings.dark_button_color,
        dark_button_hover_color: settings.dark_button_hover_color,
        dark_button_text_color: settings.dark_button_text_color,
        dark_link_color: settings.dark_link_color,
        dark_link_hover_color: settings.dark_link_hover_color,
        dark_header_background_color: settings.dark_header_background_color,
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

        <form onSubmit={handleSubmit} className="space-y-8 mt-8">

          {/* Stripe & General Settings */}
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
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Stripe Publishable Key */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Stripe Publishable Key</label>
                  <Input name="stripe_publishable_key" placeholder="pk_live_..." value={settings.stripe_publishable_key || ''} onChange={handleChange} />
                </div>

                {/* Stripe Secret Key */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Stripe Secret Key</label>
                  <Input name="stripe_secret" type="password" placeholder="sk_live_..." value={settings.stripe_secret || ''} onChange={handleChange} />
                </div>

                {/* Stripe Webhook Secret */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Stripe Webhook Secret</label>
                  <Input name="stripe_webhook_secret" type="password" placeholder="whsec_..." value={settings.stripe_webhook_secret || ''} onChange={handleChange} />
                </div>

                {/* Header Visibility */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Show Header?</label>
                  <select name="show_header" className="border rounded px-2 py-2 w-full bg-background" value={settings.show_header === null ? '' : settings.show_header ? 'true' : 'false'} onChange={handleChange}>
                    <option value="" disabled>Select...</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Theme Colors Card with Tabs */}
          <Card>
             <CardHeader className="flex flex-row items-start justify-between">
               <div>
                 <CardTitle className="flex items-center">
                   <SettingsIcon className="h-5 w-5 mr-2 text-primary" />
                   Theme Colors
                 </CardTitle>
                 <CardDescription>Customize colors for light and dark mode.</CardDescription>
               </div>
             </CardHeader>
             <CardContent className="space-y-6">
               <Tabs defaultValue="light" className="space-y-6">
                 <TabsList className="flex gap-2 w-full">
                   <TabsTrigger value="light" className="w-[49%] data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-[#d8d8d8] dark:data-[state=active]:bg-muted">Light</TabsTrigger>
                   <TabsTrigger value="dark" className="w-[49%] data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-[#d8d8d8] dark:data-[state=active]:bg-muted">Dark</TabsTrigger>
                 </TabsList>

                 {/* LIGHT TAB */}
                 <TabsContent value="light" className="space-y-6">
                   <div className="flex justify-end">
                     <Button type="button" variant="outline" size="sm" onClick={() => {
                       const defaults = {
                         primary_color: '#3A72BB',
                         secondary_color: '#33363B',
                         background_color: '#F0F7FF',
                         headline_text_color: '#33363B',
                         paragraph_text_color: '#4A4A4A',
                         button_color: '#3A72BB',
                         button_hover_color: '#33363B',
                         button_text_color: '#FFFFFF',
                         link_color: '#3A72BB',
                         link_hover_color: '#33363B',
                         header_background_color: '#FFFFFF',
                       } as Partial<AdminSettingsRow>
                       setSettings((prev) => ({ ...prev, ...defaults }))
                     }}>Clear</Button>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     {/* Primary Color */}
                     <div className="space-y-2">
                       <label className="text-sm font-medium">Primary Color</label>
                       <Input name="primary_color" type="color" className="h-12 w-full" value={settings.primary_color || '#3A72BB'} onChange={handleChange} />
                     </div>
                     {/* Secondary Color */}
                     <div className="space-y-2">
                       <label className="text-sm font-medium">Secondary Color</label>
                       <Input name="secondary_color" type="color" className="h-12 w-full" value={settings.secondary_color || '#33363B'} onChange={handleChange} />
                     </div>
                     {/* Background Color */}
                     <div className="space-y-2">
                       <label className="text-sm font-medium">Background Color</label>
                       <Input name="background_color" type="color" className="h-12 w-full" value={settings.background_color || '#F0F7FF'} onChange={handleChange} />
                     </div>
                     {/* Headline Text Color */}
                     <div className="space-y-2">
                       <label className="text-sm font-medium">Headline Text Color</label>
                       <Input name="headline_text_color" type="color" className="h-12 w-full" value={settings.headline_text_color || '#33363B'} onChange={handleChange} />
                     </div>
                     {/* Paragraph Text Color */}
                     <div className="space-y-2">
                       <label className="text-sm font-medium">Paragraph Text Color</label>
                       <Input name="paragraph_text_color" type="color" className="h-12 w-full" value={settings.paragraph_text_color || '#4A4A4A'} onChange={handleChange} />
                     </div>
                     {/* Button Color */}
                     <div className="space-y-2">
                       <label className="text-sm font-medium">Button Color</label>
                       <Input name="button_color" type="color" className="h-12 w-full" value={settings.button_color || '#3A72BB'} onChange={handleChange} />
                     </div>
                     {/* Button Hover Color */}
                     <div className="space-y-2">
                       <label className="text-sm font-medium">Button Hover Color</label>
                       <Input name="button_hover_color" type="color" className="h-12 w-full" value={settings.button_hover_color || '#33363B'} onChange={handleChange} />
                     </div>
                     {/* Button Text Color */}
                     <div className="space-y-2">
                       <label className="text-sm font-medium">Button Text Color</label>
                       <Input name="button_text_color" type="color" className="h-12 w-full" value={settings.button_text_color || '#FFFFFF'} onChange={handleChange} />
                     </div>
                     {/* Link Color */}
                     <div className="space-y-2">
                       <label className="text-sm font-medium">Link Color</label>
                       <Input name="link_color" type="color" className="h-12 w-full" value={settings.link_color || '#3A72BB'} onChange={handleChange} />
                     </div>
                     {/* Link Hover Color */}
                     <div className="space-y-2">
                       <label className="text-sm font-medium">Link Hover Color</label>
                       <Input name="link_hover_color" type="color" className="h-12 w-full" value={settings.link_hover_color || '#33363B'} onChange={handleChange} />
                     </div>
                     {/* Header Background Color */}
                     <div className="space-y-2">
                       <label className="text-sm font-medium">Header Background Color</label>
                       <Input name="header_background_color" type="color" className="h-12 w-full" value={settings.header_background_color || '#FFFFFF'} onChange={handleChange} />
                     </div>
                   </div>
                 </TabsContent>

                 {/* DARK TAB */}
                 <TabsContent value="dark" className="space-y-6">
                   <div className="flex justify-end">
                     <Button type="button" variant="outline" size="sm" onClick={() => {
                       const defaults = {
                         dark_primary_color: null,
                         dark_secondary_color: null,
                         dark_background_color: null,
                         dark_headline_text_color: null,
                         dark_paragraph_text_color: null,
                         dark_button_color: null,
                         dark_button_hover_color: null,
                         dark_button_text_color: null,
                         dark_link_color: null,
                         dark_link_hover_color: null,
                         dark_header_background_color: null,
                       } as Partial<AdminSettingsRow>
                       setSettings((prev) => ({ ...prev, ...defaults }))
                     }}>Clear</Button>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     {/* Dark Primary */}
                     <div className="space-y-2">
                       <label className="text-sm font-medium">Primary Color</label>
                       <Input type="color" name="dark_primary_color" className="h-12 w-full" value={settings.dark_primary_color || '#3A72BB'} onChange={handleChange}/>
                     </div>
                     {/* Dark Secondary */}
                     <div className="space-y-2">
                       <label className="text-sm font-medium">Secondary Color</label>
                       <Input type="color" name="dark_secondary_color" className="h-12 w-full" value={settings.dark_secondary_color || '#2C2C2C'} onChange={handleChange}/>
                     </div>
                     {/* Dark Background */}
                     <div className="space-y-2">
                       <label className="text-sm font-medium">Background Color</label>
                       <Input type="color" name="dark_background_color" className="h-12 w-full" value={settings.dark_background_color || '#0D0D0D'} onChange={handleChange}/>
                     </div>
                     {/* Dark Headline Text */}
                     <div className="space-y-2">
                       <label className="text-sm font-medium">Headline Text Color</label>
                       <Input type="color" name="dark_headline_text_color" className="h-12 w-full" value={settings.dark_headline_text_color || '#FFFFFF'} onChange={handleChange}/>
                     </div>
                     {/* Dark Paragraph */}
                     <div className="space-y-2">
                       <label className="text-sm font-medium">Paragraph Text Color</label>
                       <Input type="color" name="dark_paragraph_text_color" className="h-12 w-full" value={settings.dark_paragraph_text_color || '#EDEDED'} onChange={handleChange}/>
                     </div>
                     {/* Dark Button Color */}
                     <div className="space-y-2">
                       <label className="text-sm font-medium">Button Color</label>
                       <Input type="color" name="dark_button_color" className="h-12 w-full" value={settings.dark_button_color || '#3A72BB'} onChange={handleChange}/>
                     </div>
                     {/* Dark Button Hover */}
                     <div className="space-y-2">
                       <label className="text-sm font-medium">Button Hover Color</label>
                       <Input type="color" name="dark_button_hover_color" className="h-12 w-full" value={settings.dark_button_hover_color || '#33363B'} onChange={handleChange}/>
                     </div>
                     {/* Dark Button Text */}
                     <div className="space-y-2">
                       <label className="text-sm font-medium">Button Text Color</label>
                       <Input type="color" name="dark_button_text_color" className="h-12 w-full" value={settings.dark_button_text_color || '#FFFFFF'} onChange={handleChange}/>
                     </div>
                     {/* Dark Link Color */}
                     <div className="space-y-2">
                       <label className="text-sm font-medium">Link Color</label>
                       <Input type="color" name="dark_link_color" className="h-12 w-full" value={settings.dark_link_color || '#FFFFFF'} onChange={handleChange}/>
                     </div>
                     {/* Dark Link Hover */}
                     <div className="space-y-2">
                       <label className="text-sm font-medium">Link Hover Color</label>
                       <Input type="color" name="dark_link_hover_color" className="h-12 w-full" value={settings.dark_link_hover_color || '#3872BB'} onChange={handleChange}/>
                     </div>
                     {/* Dark Header BG */}
                     <div className="space-y-2">
                       <label className="text-sm font-medium">Header Background Color</label>
                       <Input type="color" name="dark_header_background_color" className="h-12 w-full" value={settings.dark_header_background_color || '#0D0D0D'} onChange={handleChange}/>
                     </div>
                   </div>
                 </TabsContent>

               </Tabs>
             </CardContent>
           </Card>
            <div className="flex justify-end mt-6">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </form>
      </div>
    </div>
  );
} 