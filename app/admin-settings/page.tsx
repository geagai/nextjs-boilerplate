import { requireAuth, isAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { AdminSettingsClient } from "./admin-settings-client";
import { cookies } from "next/headers";
import { createServerClient } from "@/lib/supabase";

interface AdminSettingsRow {
  id?: string
  stripe_publishable_key: string | null
  stripe_secret: string | null
  stripe_webhook_secret: string | null
  show_header: boolean | null
}

export default async function AdminSettingsPage() {
  // Server-side auth check - redirects if not authenticated
  const { user } = await requireAuth();
  
  // Check admin role - redirect if not admin
  if (!isAdmin(user)) {
    redirect("/dashboard");
  }

  // Fetch settings server-side
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);
  
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
    id: settings.id,
  } : {
    stripe_publishable_key: "",
    stripe_secret: "",
    stripe_webhook_secret: "",
    show_header: null,
  };

  return <AdminSettingsClient initialSettings={initialSettings} />;
} 