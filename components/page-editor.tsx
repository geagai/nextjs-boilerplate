"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { Editor } from '@tiptap/core';

// Dynamically import the Tiptap-based editor to avoid SSR issues
// (Unused variable removed)

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
  const [codeView, setCodeView] = useState(false);
  const [html, setHtml] = useState(initialContent ?? "");

  // Check admin status on mount
  useEffect(() => {
    (async () => {
      if (!supabase) return;
      const { data, error } = await supabase.rpc("is_admin");
      if (!error) setIsAdmin(!!data);
    })();
  }, [supabase]);

  // Keep html state in sync with content
  useEffect(() => {
    if (!codeView) setHtml(content);
  }, [content, codeView]);

  const handleSave = async () => {
    if (!supabase) return;
    setSaving(true);
    // Check if a row exists in the pages table
    const { data: existingRows, error: fetchError } = await supabase
      .from("pages")
      .select("*")
      .limit(1);

    let error = null;
    if (fetchError) {
      error = fetchError;
    } else if (existingRows && existingRows.length > 0) {
      // Update the first row
      const rowId = existingRows[0].id;
      const { error: updateError } = await supabase
        .from("pages")
        .update({ [column]: codeView ? html : content })
        .eq("id", rowId);
      error = updateError;
    } else {
      // Insert a new row
      const { error: insertError } = await supabase
        .from("pages")
        .insert({ [column]: codeView ? html : content });
      error = insertError;
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

  // --- Toolbar for text alignment ---
  function AlignmentToolbar({ editor }: { editor: Editor | null }) {
    if (!editor) return null;
    return (
      <div className="flex gap-1 mb-2">
        <Button size="sm" variant={editor.isActive("textAlign", { textAlign: "left" }) ? "default" : "outline"} onClick={() => editor.chain().focus().setTextAlign("left").run()}>Left</Button>
        <Button size="sm" variant={editor.isActive("textAlign", { textAlign: "center" }) ? "default" : "outline"} onClick={() => editor.chain().focus().setTextAlign("center").run()}>Center</Button>
        <Button size="sm" variant={editor.isActive("textAlign", { textAlign: "right" }) ? "default" : "outline"} onClick={() => editor.chain().focus().setTextAlign("right").run()}>Right</Button>
        <Button size="sm" variant={editor.isActive("textAlign", { textAlign: "justify" }) ? "default" : "outline"} onClick={() => editor.chain().focus().setTextAlign("justify").run()}>Justify</Button>
      </div>
    );
  }

  // --- Dynamic import for RichTextEditor with text alignment ---
  const RichTextEditorWithAlignment = dynamic(async () => {
    const mod = await import("@/components/ui/rich-text-editor");
    const { useEditor } = await import("@tiptap/react");
    const StarterKit = (await import("@tiptap/starter-kit")).default;
    const Link = (await import("@tiptap/extension-link")).default;
    const TextAlign = (await import("@tiptap/extension-text-align")).default;
    return function EditorWithAlignment(props: {
      value: string;
      onChange: (html: string) => void;
      className?: string;
      placeholder?: string;
      minHeight?: number;
    }) {
      const editor = useEditor({
        extensions: [StarterKit, Link, TextAlign.configure({ types: ["heading", "paragraph"] })],
        content: props.value || "",
        onUpdate({ editor }: { editor: Editor }) {
          props.onChange(editor.getHTML());
        },
        editorProps: {
          attributes: {
            class: `prose prose-sm max-w-none focus:outline-none ${props.className ?? ""}`,
            spellCheck: "true",
          },
        },
      });
      return (
        <>
          <AlignmentToolbar editor={editor} />
          <mod.default {...props} />
        </>
      );
    };
  }, { ssr: false });

  return (
    <div className={className}>
      {!editMode && (
        <div className="flex justify-end">
          <Button size="sm" onClick={() => setEditMode(true)}>
            Edit
          </Button>
        </div>
      )}

      {editMode ? (
        <div className="space-y-4">
          <div className="flex gap-2 mb-2">
            <Button size="sm" variant={codeView ? "default" : "outline"} onClick={() => setCodeView(false)}>WYSIWYG</Button>
            <Button size="sm" variant={codeView ? "outline" : "default"} onClick={() => setCodeView(true)}>Code View</Button>
          </div>
          {codeView ? (
            <textarea
              className="w-full min-h-[500px] font-mono border rounded p-2"
              value={html}
              onChange={e => setHtml(e.target.value)}
              onBlur={() => setContent(html)}
            />
          ) : (
            <RichTextEditorWithAlignment value={content} onChange={setContent} />
          )}
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-1 animate-spin" />} Save
            </Button>
            <Button variant="outline" onClick={() => {
              setContent(initialContent ?? "");
              setHtml(initialContent ?? "");
              setEditMode(false);
              setCodeView(false);
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