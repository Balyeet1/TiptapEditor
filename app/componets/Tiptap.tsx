'use client'

import Link from '@tiptap/extension-link'
import CustomImage from "@/app/componets/customImage"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Dropcursor from '@tiptap/extension-dropcursor'


const Tiptap = ({ className, content, onChange }: { className?: string, content?: string, onChange?: any }) => {
    const editor = useEditor({
        editorProps: {
            attributes: {
                class: className || ""
            }
        },
        onUpdate: ({ editor }) => {
            const htmlContent = editor.getHTML();
            onChange(htmlContent)

        },
        extensions: [
            StarterKit,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Link.configure({
                openOnClick: true,
            }),
            CustomImage,
            Dropcursor.configure({
                color: '#ff0000',
                width: 1,
            }),
        ],
        content: content,
    })

    if (!editor) {
        return null
    }

    const addImage = () => {
        const url = window.prompt('URL')

        const commands: any = editor.commands

        commands.setImage({ src: url })

    }

    return (
        <div>
            <div className="flex justify-between border border-white mb-5">
                <button onClick={addImage}>Add image from URL</button>
                <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}>
                    Left
                </button>
                <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}>
                    Center
                </button>
                <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}>
                    Right
                </button>
            </div>
            <EditorContent editor={editor} />
        </div>
    )
}

export default Tiptap