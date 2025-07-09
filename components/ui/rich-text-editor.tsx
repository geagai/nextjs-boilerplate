"use client";

import React, { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Strikethrough as StrikethroughIcon,
  Code as CodeIcon,
  List as ListIcon,
  ListOrdered as ListOrderedIcon,
  Quote as QuoteIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: number;
}

export default function RichTextEditor({ value, onChange, placeholder, className, minHeight = 500 }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Link],
    content: value || "",
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none focus:outline-none ${className ?? ""}`,
        spellCheck: "true",
      },
    },
    immediatelyRender: false,
  });

  // Keep editor content in sync when the parent value changes externally (e.g., form reset)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", false);
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="border rounded px-2 py-2 bg-background text-[80%]">Loading editor…</div>
    );
  }

  const ToolbarButton = ({
    onClick,
    active,
    disabled,
    children,
  }: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-1 rounded hover:bg-accent disabled:opacity-50 disabled:pointer-events-none ${
        active ? "bg-primary/10 text-primary" : ""
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="border rounded bg-background text-[80%] relative">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 border-b border-input p-1 bg-muted/20 sticky top-0 z-10">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          disabled={!editor.can().chain().focus().toggleBold().run()}
        >
          <BoldIcon size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
        >
          <ItalicIcon size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
        >
          <StrikethroughIcon size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
          disabled={!editor.can().chain().focus().toggleCode().run()}
        >
          <CodeIcon size={16} />
        </ToolbarButton>
        <div className="w-px bg-border mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
        >
          <span className="text-xs font-bold">H1</span>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
        >
          <span className="text-xs font-bold">H2</span>
        </ToolbarButton>
        <div className="w-px bg-border mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        >
          <ListIcon size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        >
          <ListOrderedIcon size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
        >
          <QuoteIcon size={16} />
        </ToolbarButton>
        <div className="w-px bg-border mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
        >
          <UndoIcon size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        >
          <RedoIcon size={16} />
        </ToolbarButton>
      </div>

      {/* Editable content */}
      <div className={"p-2 bg-white"} style={{ minHeight: minHeight }}>
        <EditorContent editor={editor} />
        {editor.isEmpty && !editor.isFocused && placeholder ? (
          <p className="pointer-events-none absolute opacity-50 select-none m-0">
            {placeholder}
          </p>
        ) : null}
      </div>
    </div>
  );
} 