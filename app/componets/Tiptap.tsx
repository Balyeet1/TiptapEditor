'use client'

import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import { createLowlight } from 'lowlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Link from '@tiptap/extension-link'
import CustomImage from "@/app/componets/customImage"
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Dropcursor from '@tiptap/extension-dropcursor'
import js from 'highlight.js/lib/languages/javascript'
import Highlight from '@tiptap/extension-highlight'


const lowlight = createLowlight()
lowlight.register("js", js)


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
            Highlight,
            CodeBlockLowlight.configure({
                lowlight: lowlight
            }),
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
                <button
                    onClick={() => editor.chain().focus().setCodeBlock().run()}
                    disabled={editor.isActive('codeBlock')}
                >
                    Set code block
                </button>
                <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}>
                    H1
                </button>
                <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}>
                    H2
                </button>
                <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}>
                    H3
                </button>
                <button onClick={() => editor.chain().focus().toggleHighlight().run()} className={editor.isActive('highlight') ? 'is-active' : ''}>
                    Highlight
                </button>

            </div>
            {editor && <BubbleMenu editor={editor} shouldShow={({ state, from }) => {
                const $pos = state.doc.resolve(from)
                const node = $pos.node($pos.depth);
                return node.type.name !== 'doc' && node.type.name !== 'codeBlock'
            }}
                updateDelay={50} tippyOptions={{ duration: 100 }}>
                <div className="bubble-menu">
                    <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}>
                        Left
                    </button>
                    <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}>
                        Center
                    </button>
                    <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}>
                        Right
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={editor.isActive('bold') ? 'is-active' : ''}
                    >
                        Bold
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={editor.isActive('italic') ? 'is-active' : ''}
                    >
                        Italic
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={editor.isActive('strike') ? 'is-active' : ''}
                    >
                        Strike
                    </button>
                </div>
            </BubbleMenu>}
            <EditorContent editor={editor} />
        </div >
    )
}

export default Tiptap