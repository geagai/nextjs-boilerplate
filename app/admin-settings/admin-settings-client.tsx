"use client";

import { useState, useEffect } from "react";
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
import dynamic from "next/dynamic";
import { useAdminSettings } from "@/components/admin-settings-provider";
import { adminSettingsCache } from "@/lib/admin-settings-cache";


// Dynamically import the RichTextEditor to avoid SSR issues
const RichTextEditor = dynamic(() => import("@/components/ui/rich-text-editor"), { ssr: false });

interface AdminSettingsRow {
  id?: string
  stripe_publishable_key: string | null
  stripe_secret: string | null
  stripe_webhook_secret: string | null
  show_header: boolean | null
  sticky_header: boolean | null
  email: string | null
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
  dev_mode: boolean | null
  pricing_page_headline: string | null
  pricing_page_description: string | null
  pricing_page_faq: { question: string, answer: string }[] | null
  footer_background_color: string | null
  dark_footer_background_color: string | null
  footer_text_color: string | null
  dark_footer_text_color: string | null
  footer_link_color: string | null
  dark_footer_link_color: string | null
  site_name: string | null
  footer_html_one: string | null
  footer_html_two: string | null
  repo: string | null
}

interface AdminSettingsClientProps {
  initialSettings: AdminSettingsRow
}

export function AdminSettingsClient({ initialSettings }: AdminSettingsClientProps) {
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<AdminSettingsRow>(initialSettings);
  const [clearingCache, setClearingCache] = useState(false);
  const supabase = createClient();
  // Don't use useAdminSettings for form data - only use server-side initialSettings
  // const { clearCacheAndRefresh } = useAdminSettings();
  const { clearCacheAndRefresh } = useAdminSettings();
  const [supabaseReady, setSupabaseReady] = useState(false);

  // Ensure we always have the ID from server-side props
  useEffect(() => {
    if (initialSettings.id && !settings.id) {
      console.log('Admin Settings - Restoring ID from server props:', initialSettings.id);
      setSettings(prev => ({ ...prev, id: initialSettings.id }));
    }
  }, [initialSettings.id, settings.id]);

  // Debug: check admin status on mount and set ready state
  useEffect(() => {
    console.log('Admin Settings - Component mounted');
    console.log('Admin Settings - Initial supabase client:', supabase);
    
    // Set Supabase as ready if client exists
    if (supabase) {
      setSupabaseReady(true);
      console.log('Admin Settings - Supabase client ready');
    }
    
    async function checkAdminStatus() {
      if (!supabase) {
        console.log('Admin Settings - Supabase client is null, skipping admin check');
        return;
      }
      const { data, error } = await supabase.rpc('is_admin');
      if (error) {
        console.error('is_admin RPC error:', error);
      } else {
        console.log('is_admin RPC result:', data);
      }
    }
    checkAdminStatus();
  }, [supabase]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]:
      name === "show_header" || name === "dev_mode" || name === "sticky_header" ? (value === '' ? null : value === 'true') : value
    }));
  };

  const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
    const newFaqs = [...(settings.pricing_page_faq || [])];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    setSettings((prev) => ({ ...prev, pricing_page_faq: newFaqs }));
  };

  const addFaqItem = () => {
    const newFaqs = [...(settings.pricing_page_faq || []), { question: '', answer: '' }];
    setSettings((prev) => ({ ...prev, pricing_page_faq: newFaqs }));
  };

  const removeFaqItem = (index: number) => {
    const newFaqs = [...(settings.pricing_page_faq || [])];
    newFaqs.splice(index, 1);
    setSettings((prev) => ({ ...prev, pricing_page_faq: newFaqs }));
  };

  const handleClearCache = async () => {
    setClearingCache(true);
    console.log('Admin Settings - handleClearCache called');
    try {
      await clearCacheAndRefresh();
      toast({ title: "Cache cleared successfully" });
    } catch (error) {
      console.error('Error clearing cache:', error);
      toast({ title: "Failed to clear cache", variant: "destructive" });
    } finally {
      setClearingCache(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    console.log('Admin Settings - handleSubmit called');
    console.log('Admin Settings - supabase client:', supabase);
    console.log('Admin Settings - supabase is null?', !supabase);
    console.log('Admin Settings - supabase ready?', supabaseReady);

    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }
      
      console.log('Admin Settings - Creating payload...');
      const payload = {
        stripe_publishable_key: settings.stripe_publishable_key,
        stripe_secret: settings.stripe_secret,
        stripe_webhook_secret: settings.stripe_webhook_secret,
        show_header: settings.show_header,
        sticky_header: settings.sticky_header,
        email: settings.email,
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
        dev_mode: settings.dev_mode,
        pricing_page_headline: settings.pricing_page_headline,
        pricing_page_description: settings.pricing_page_description,
        pricing_page_faq: settings.pricing_page_faq,
        // footer settings
        footer_background_color: settings.footer_background_color,
        dark_footer_background_color: settings.dark_footer_background_color,
        footer_text_color: settings.footer_text_color,
        dark_footer_text_color: settings.dark_footer_text_color,
        footer_link_color: settings.footer_link_color,
        dark_footer_link_color: settings.dark_footer_link_color,
        site_name: settings.site_name,
        footer_html_one: settings.footer_html_one,
        footer_html_two: settings.footer_html_two,
        repo: settings.repo,
      } as const;

      console.log('Admin Settings - Payload created:', payload);
      console.log('Admin Settings - Settings ID:', settings.id);

      let error;
      // Always use upsert - it will insert if no ID exists, update if ID exists
      console.log('Admin Settings - Using upsert with ID:', settings.id);
      const { error: upsertError, data } = await supabase
        .from("admin_settings")
        .upsert({ ...payload, ...(settings.id && { id: settings.id }) })
        .select()
        .single();
      
      error = upsertError;
      console.log('Admin Settings - Upsert error:', error);
      console.log('Admin Settings - Upsert result data:', data);
      
      // Update the ID if we got one back
      if (!error && data?.id && !settings.id) {
        console.log('Admin Settings - Setting ID from upsert result:', data.id);
        setSettings((prev) => ({ ...prev, id: data.id }));
      }

      if (error) {
        console.log('Admin Settings - Database error, throwing:', error);
        throw error;
      }

      console.log('Admin Settings - Database operation successful, clearing cache...');
      // Clear and refresh the admin settings cache after save
      await adminSettingsCache.clearCacheAndRefresh();
      await clearCacheAndRefresh();
      toast({ title: "Settings saved successfully" });
    } catch (err) {
      console.error('Admin Settings - Error in handleSubmit:', err);
      toast({ title: "Failed to save settings", variant: "destructive" });
    } finally {
      console.log('Admin Settings - Finally block reached, setting saving to false');
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Admin Settings</h1>
            <p className="text-muted-foreground mt-2">Manage global configuration and integrations.</p>
          </div>
          <button
            type="button"
            onClick={handleClearCache}
            disabled={clearingCache || !supabaseReady}
            className="px-4 py-2 bg-white hover:bg-gray-100 border border-[#d8d8d8] rounded-[10px] text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #d8d8d8',
              borderRadius: '10px'
            }}
            onMouseEnter={(e) => {
              if (!clearingCache && supabaseReady) {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }
            }}
            onMouseLeave={(e) => {
              if (!clearingCache && supabaseReady) {
                e.currentTarget.style.backgroundColor = '#ffffff';
              }
            }}
          >
            {clearingCache ? 'Clearing...' : !supabaseReady ? 'Loading...' : 'Clear Cache'}
          </button>
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
                Update your header visibility preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {(!process.env.NEXT_PUBLIC_STRIPE_KEY || !process.env.NEXT_PUBLIC_STRIPE_SECRET) && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mb-4">
                  <strong>Stripe environment variables missing:</strong><br />
                  Please set <code>NEXT_PUBLIC_STRIPE_KEY</code> and <code>NEXT_PUBLIC_STRIPE_SECRET</code> in your <code>.env</code> file to enable Stripe integration.
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Header Visibility */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Show Header?</label>
                  <select name="show_header" className="border rounded px-2 py-2 w-full bg-background" value={settings.show_header === null ? '' : settings.show_header ? 'true' : 'false'} onChange={handleChange}>
                    <option value="" disabled>Select...</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                {/* Sticky Header */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sticky Header?</label>
                  <select name="sticky_header" className="border rounded px-2 py-2 w-full bg-background" value={settings.sticky_header === null ? '' : settings.sticky_header ? 'true' : 'false'} onChange={handleChange}>
                    <option value="" disabled>Select...</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                {/* Developer Mode */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Developer Mode</label>
                  <select name="dev_mode" className="border rounded px-2 py-2 w-full bg-background" value={settings.dev_mode === null ? '' : settings.dev_mode ? 'true' : 'false'} onChange={handleChange}>
                    <option value="" disabled>Select...</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                {/* Contact Email */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Contact Email</label>
                  <Input name="email" type="email" placeholder="contact@yoursite.com" value={settings.email || ''} onChange={handleChange} />
                  <p className="text-xs text-muted-foreground">Email address where contact form submissions will be sent</p>
                </div>
                {/* Repository URL */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Repository URL</label>
                  <Input name="repo" type="text" placeholder="https://github.com/your-org/your-repo" value={settings.repo || ''} onChange={handleChange} />
                  <p className="text-xs text-muted-foreground">URL of the GitHub repository to be used for deployment/forking</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Page Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <SettingsIcon className="h-5 w-5 mr-2 text-primary" />
                Pricing Page
              </CardTitle>
              <CardDescription>
                Customize the content of your pricing page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pricing Page Headline */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Pricing Page Headline</label>
                <Input name="pricing_page_headline" placeholder="Enter headline..." value={settings.pricing_page_headline || ''} onChange={handleChange} />
              </div>

              {/* Pricing Page Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Pricing Page Description</label>
                <textarea name="pricing_page_description" rows={3} className="border rounded px-2 py-2 w-full bg-background" placeholder="Enter description..." value={settings.pricing_page_description || ''} onChange={(e) => setSettings(prev => ({...prev, pricing_page_description: e.target.value}))} />
              </div>

              {/* Pricing Page FAQ */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <label className="text-sm font-medium mr-5">Pricing Page FAQ</label>
                  <Button type="button" variant="outline" size="sm" onClick={addFaqItem}>Add FAQ Item</Button>
                </div>
                {settings.pricing_page_faq?.map((faq, index) => (
                  <div key={index} className="p-4 border rounded space-y-2 relative">
                    <Button type="button" variant="ghost" size="sm" className="absolute top-2 right-2" onClick={() => removeFaqItem(index)}>X</Button>
                    <div className="space-y-1">
                      <label className="text-xs font-medium">Question</label>
                      <Input placeholder="FAQ Question" value={faq.question} onChange={(e) => handleFaqChange(index, 'question', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium">Answer</label>
                      <textarea rows={2} className="border rounded px-2 py-2 w-full bg-background" placeholder="FAQ Answer" value={faq.answer} onChange={(e) => handleFaqChange(index, 'answer', e.target.value)} />
                    </div>
                  </div>
                ))}
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
                     {/* Footer Background Color */}
                     <div className="space-y-2">
                       <label className="text-sm font-medium">Footer Background Color</label>
                       <Input type="color" name="footer_background_color" className="h-12 w-full" value={settings.footer_background_color || '#F7F9FB'} onChange={handleChange} />
                     </div>
                     {/* Footer Text Color */}
                     <div className="space-y-2">
                       <label className="text-sm font-medium">Footer Text Color</label>
                       <Input type="color" name="footer_text_color" className="h-12 w-full" value={settings.footer_text_color || '#33363B'} onChange={handleChange} />
                     </div>
                     {/* Footer Link Color */}
                     <div className="space-y-2">
                       <label className="text-sm font-medium">Footer Link Color</label>
                       <Input type="color" name="footer_link_color" className="h-12 w-full" value={settings.footer_link_color || '#3A72BB'} onChange={handleChange} />
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
                     {/* Dark Footer Background Color */}
                     <div className="space-y-2">
                       <label className="text-sm font-medium">Dark Footer Background</label>
                       <Input type="color" name="dark_footer_background_color" className="h-12 w-full" value={settings.dark_footer_background_color || '#0D0D0D'} onChange={handleChange} />
                     </div>
                     {/* Dark Footer Text Color */}
                     <div className="space-y-2">
                       <label className="text-sm font-medium">Dark Footer Text Color</label>
                       <Input type="color" name="dark_footer_text_color" className="h-12 w-full" value={settings.dark_footer_text_color || '#EDEDED'} onChange={handleChange} />
                     </div>
                     {/* Dark Footer Link Color */}
                     <div className="space-y-2">
                       <label className="text-sm font-medium">Dark Footer Link Color</label>
                       <Input type="color" name="dark_footer_link_color" className="h-12 w-full" value={settings.dark_footer_link_color || '#3A72BB'} onChange={handleChange} />
                     </div>
                   </div>
                 </TabsContent>

               </Tabs>
             </CardContent>
           </Card>

          {/* Footer Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <SettingsIcon className="h-5 w-5 mr-2 text-primary" />
                Footer Settings
              </CardTitle>
              <CardDescription>
                Customize footer colors, site name and column content.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contact Email & Site Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Contact Email</label>
                <Input name="email" placeholder="contact@example.com" value={settings.email || ''} onChange={handleChange} />
              </div>
              {/* Site Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Site Name</label>
                <Input name="site_name" placeholder="Enter site name..." value={settings.site_name || ''} onChange={handleChange} />
              </div>
              {/* Footer HTML Columns */}
              <div className="space-y-4">
                <label className="text-sm font-medium">Footer Column Two HTML</label>
                <RichTextEditor
                  value={settings.footer_html_one || ""}
                  onChange={(html) =>
                    setSettings((prev) => ({ ...prev, footer_html_one: html }))
                  }
                  placeholder="Enter HTML for footer column two…"
                  minHeight={200}
                />
                <label className="text-sm font-medium">Footer Column Three HTML</label>
                <RichTextEditor
                  value={settings.footer_html_two || ""}
                  onChange={(html) =>
                    setSettings((prev) => ({ ...prev, footer_html_two: html }))
                  }
                  placeholder="Enter HTML for footer column three…"
                  minHeight={200}
                />
              </div>
            </CardContent>
          </Card>
            <div className="flex justify-end mt-6">
              <Button type="submit" disabled={saving || !supabaseReady}>
                {saving ? "Saving..." : !supabaseReady ? "Loading..." : "Save Settings"}
              </Button>
            </div>
          </form>
      </div>
    </div>
  );
} 