"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

// Dynamically import the Tiptap-based editor to avoid SSR issues
const RichTextEditor = dynamic(() => import("@/components/ui/rich-text-editor"), { ssr: false });

interface PageEditorProps {
  /** Column name in the `pages` table to read/write, e.g. `terms_service` */
  column: "terms_service" | "privacy_policy" | "contact_us";
  /** Initial HTML content passed from server */
  initialContent: string | null;
  /** Optional: wrapper CSS classes */
  className?: string;
}

export function PageEditor({ column, initialContent, className }: PageEditorProps) {
  const supabase = createClient();

  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [content, setContent] = useState<string>(initialContent ?? "");
  const [saving, setSaving] = useState(false);

  // Check admin status on mount
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.rpc("is_admin");
      if (!error) setIsAdmin(!!data);
    })();
  }, [supabase]);

  const handleSave = async () => {
    setSaving(true);
    // Upsert single-row strategy: assume only one row in pages table.
    const { error } = await supabase
      .from("pages")
      .update({ [column]: content })
      .neq(column, null) // ensure update occurs even if previously null
      .limit(1);

    // If no rows were updated, insert new
    if (error?.code === "PGRST116" || !error) {
      await supabase.from("pages").insert({ [column]: content }).single();
    }

    if (error) {
      toast({ title: "Failed to save", variant: "destructive" });
    } else {
      toast({ title: "Saved" });
      setEditMode(false);
    }
    setSaving(false);
  };

  if (!isAdmin) {
    // Non-admins just see rendered content
    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: content || "<p></p>" }}
      />
    );
  }



  return (
    <div className={className}>
      {!editMode && (
          <div className="flex justify-end">
            <Button 
              size="sm" 
              onClick={() => setEditMode(true)}
            >
              Edit
            </Button>
          </div>
        )}

      {editMode ? (
        <div className="space-y-4">
          <RichTextEditor value={content} onChange={setContent} />
          <div className="flex gap-2">
            <Button 
              onClick={handleSave} 
              disabled={saving}
            >
              {saving && <Loader2 className="h-4 w-4 mr-1 animate-spin" />} Save
            </Button>
            <Button variant="outline" onClick={() => {
              setContent(initialContent ?? "");
              setEditMode(false);
            }}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: content || "<p></p>" }}
        />
      )}
    </div>
  );
} 