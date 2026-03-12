"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import {
  Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered,
  Link as LinkIcon, Image as ImageIcon, Code, Undo, Redo, Strikethrough,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface TextEditorProps {
  content?: string
  onChange?: (html: string) => void
  placeholder?: string
  className?: string
  editable?: boolean
}

interface ToolbarButtonProps {
  onClick: () => void
  active?: boolean
  children: React.ReactNode
  title: string
}

// Defined at module level — avoids "Cannot create components during render" lint error
const ToolbarButton = ({ onClick, active, children, title }: ToolbarButtonProps) => (
  <Button
    type="button" variant="ghost" size="sm"
    onClick={onClick}
    className={cn("h-8 w-8 p-0 cursor-pointer", active && "bg-muted text-foreground")}
    title={title}
  >
    {children}
  </Button>
)

export function TextEditor({ content = "", onChange, placeholder, className, editable = true }: TextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: true }),
    ],
    content,
    editable,
    onUpdate: ({ editor: e }) => {
      onChange?.(e.getHTML())
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[400px] p-4 focus:outline-none",
      },
    },
  })

  if (!editor) return null

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      {editable && (
        <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b bg-muted/30">
          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold">
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic">
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough">
            <Strikethrough className="h-4 w-4" />
          </ToolbarButton>
          <Separator orientation="vertical" className="h-6 mx-1" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Heading 1">
            <Heading1 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2">
            <Heading2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Heading 3">
            <Heading3 className="h-4 w-4" />
          </ToolbarButton>
          <Separator orientation="vertical" className="h-6 mx-1" />
          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet list">
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Ordered list">
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
          <Separator orientation="vertical" className="h-6 mx-1" />
          <ToolbarButton onClick={() => {
            const url = prompt("Nhập URL link:")
            if (url) editor.chain().focus().setLink({ href: url }).run()
          }} active={editor.isActive("link")} title="Link">
            <LinkIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => {
            const url = prompt("Nhập URL ảnh:")
            if (url) editor.chain().focus().setImage({ src: url }).run()
          }} title="Image">
            <ImageIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Code">
            <Code className="h-4 w-4" />
          </ToolbarButton>
          <Separator orientation="vertical" className="h-6 mx-1" />
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
            <Undo className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
            <Redo className="h-4 w-4" />
          </ToolbarButton>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  )
}
