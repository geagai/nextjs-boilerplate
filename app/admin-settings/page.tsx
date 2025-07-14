import { requireAuth, isAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSettingsClient } from "./admin-settings-client";
import { cookies } from "next/headers";
import { createServerClient } from "@/lib/supabase";

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
  dev_mode: boolean | null
  dark_header_background_color: string | null
  headline_text_color: string | null
  paragraph_text_color: string | null
  button_color: string | null
  button_hover_color: string | null
  button_text_color: string | null
  pricing_page_headline: string | null
  pricing_page_description: string | null
  pricing_page_faq: { question: string, answer: string }[] | null
  footer_html_one: string | null
  footer_html_two: string | null
  footer_color: string | null
  dark_footer_color: string | null
  footer_link_color: string | null
  dark_footer_link_color: string | null
  site_name: string | null
  footer_background_color: string | null
  dark_footer_background_color: string | null
  footer_text_color: string | null
  dark_footer_text_color: string | null
  repo: string | null
}

export default async function AdminSettingsPage() {
  // Server-side auth check - redirects if not authenticated
  const { user } = await requireAuth();
  
  // Check admin role - redirect if not admin
  if (!isAdmin(user)) {
    redirect("/dashboard");
  }

  // Fetch settings server-side
  const cookieStore = await cookies();
  const supabase = createServerClient(cookieStore);
  
  if (!supabase) {
    throw new Error('Unable to initialize Supabase client')
  }
  
  const { data: settings } = await supabase
    .from("admin_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  const initialSettings: AdminSettingsRow = settings ? {
    stripe_publishable_key: settings.stripe_publishable_key ?? "",
    stripe_secret: settings.stripe_secret ?? "",
    stripe_webhook_secret: settings.stripe_webhook_secret ?? "",
    show_header: settings.show_header ?? null,
    sticky_header: settings.sticky_header ?? null,
    email: settings.email ?? null,
    primary_color: settings.primary_color ?? "#3A72BB",
    secondary_color: settings.secondary_color ?? "#33363B",
    background_color: settings.background_color ?? "#F7F9FB",
    link_color: settings.link_color ?? "#33363B",
    link_hover_color: settings.link_hover_color ?? "#3872BB",
    header_background_color: settings.header_background_color ?? "#F7F9FB",
    dark_primary_color: settings.dark_primary_color ?? null,
    dark_secondary_color: settings.dark_secondary_color ?? null,
    dark_background_color: settings.dark_background_color ?? null,
    dark_headline_text_color: settings.dark_headline_text_color ?? null,
    dark_paragraph_text_color: settings.dark_paragraph_text_color ?? null,
    dark_button_color: settings.dark_button_color ?? null,
    dark_button_hover_color: settings.dark_button_hover_color ?? null,
    dark_button_text_color: settings.dark_button_text_color ?? null,
    dark_link_color: settings.dark_link_color ?? null,
    dark_link_hover_color: settings.dark_link_hover_color ?? null,
    dev_mode: settings.dev_mode ?? null,
    dark_header_background_color: settings.dark_header_background_color ?? null,
    headline_text_color: settings.headline_text_color ?? "#000000",
    paragraph_text_color: settings.paragraph_text_color ?? "#000000",
    button_color: settings.button_color ?? "#000000",
    button_hover_color: settings.button_hover_color ?? "#000000",
    button_text_color: settings.button_text_color ?? "#ffffff",
    footer_html_one: settings.footer_html_one ?? null,
    footer_html_two: settings.footer_html_two ?? null,
    footer_color: settings.footer_color ?? null,
    dark_footer_color: settings.dark_footer_color ?? null,
    footer_link_color: settings.footer_link_color ?? null,
    dark_footer_link_color: settings.dark_footer_link_color ?? null,
    site_name: settings.site_name ?? null,
    footer_background_color: settings.footer_background_color ?? null,
    dark_footer_background_color: settings.dark_footer_background_color ?? null,
    footer_text_color: settings.footer_text_color ?? null,
    dark_footer_text_color: settings.dark_footer_text_color ?? null,
    repo: settings.repo ?? null,
    id: settings.id,
    pricing_page_headline: settings.pricing_page_headline ?? null,
    pricing_page_description: settings.pricing_page_description ?? null,
    pricing_page_faq: settings.pricing_page_faq ?? null,
  } : {
    stripe_publishable_key: "",
    stripe_secret: "",
    stripe_webhook_secret: "",
    show_header: null,
    sticky_header: null,
    email: null,
    primary_color: "#3A72BB", // default brand color
    secondary_color: "#33363B",
    background_color: "#F7F9FB",
    link_color: "#33363B",
    link_hover_color: "#3872BB",
    header_background_color: "#F7F9FB",
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
    dev_mode: null,
    dark_header_background_color: null,
    headline_text_color: "#000000",
    paragraph_text_color: "#000000",
    button_color: "#000000",
    button_hover_color: "#000000",
    button_text_color: "#ffffff",
    footer_html_one: null,
    footer_html_two: null,
    footer_color: null,
    dark_footer_color: null,
    footer_link_color: null,
    dark_footer_link_color: null,
    site_name: null,
    footer_background_color: null,
    dark_footer_background_color: null,
    footer_text_color: null,
    dark_footer_text_color: null,
    repo: null,
    pricing_page_headline: null,
    pricing_page_description: null,
    pricing_page_faq: null,
  };

  return <AdminSettingsClient initialSettings={initialSettings} />;
} 