'use client'

import BulletList from '@tiptap/extension-bullet-list'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import OrderedList from '@tiptap/extension-ordered-list'
import CustomImage from "@/app/componets/customImage"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'


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
            BulletList,
            OrderedList,
            CustomImage
        ],
        content: content,
    })

    if (!editor) {
        return null
    }

    const addImage = () => {
        const url = window.prompt('URL')

        if (url) {
            editor.chain().setImage({ src: url }).run()
        }
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
                <button onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}>
                    Justify
                </button>
            </div>
            <EditorContent editor={editor} />
        </div>
    )
}

export default Tiptap