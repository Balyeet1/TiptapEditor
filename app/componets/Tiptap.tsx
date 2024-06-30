import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import Document from '@tiptap/extension-document'
import { createLowlight } from 'lowlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import CustomImage from "@/app/componets/customImage"
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Dropcursor from '@tiptap/extension-dropcursor'
import js from 'highlight.js/lib/languages/javascript'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import { SmilieReplacer } from '@/app/componets/smilieReplacer';
import FontFamily from '@tiptap/extension-font-family';
import TextStyle from '@tiptap/extension-text-style'
import { config } from 'process';

const CustomDocument = Document.extend({
    content: 'heading block*',
})

const lowlight = createLowlight()
lowlight.register("js", js)


const Tiptap = ({ className, content, onChange, isReadonly }: { className?: string, content?: string, onChange?: any, isReadonly: boolean }) => {

    //const ImageExtention = isReadonly ? Image : CustomImage

    const editor = useEditor({
        editable: !isReadonly,
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
            SmilieReplacer,
            CustomImage.extend({
                addAttributes() {

                    interface Config {
                        src: { default: null };
                        alt: { default: null };
                        title: { default: null };
                        width: { default: string };
                        alignment: { default: string };
                        float: { default: string };
                        editable?: boolean;
                    }

                    const configs: Config = {
                        src: { default: null },
                        alt: { default: null },
                        title: { default: null },
                        width: { default: '100%' },
                        alignment: { default: 'center' },
                        float: { default: "none" },
                    }

                    if (!isReadonly) {
                        configs.editable = true
                    }

                    return configs
                }
            }),
            CustomDocument,
            Highlight,
            TextStyle,
            FontFamily.configure({
                types: ['textStyle'],
            }),
            Placeholder.configure({
                placeholder: ({ node }) => {
                    if (node.type.name === 'heading') {
                        return 'What’s the title?'
                    }

                    return ''
                },
            }),
            CodeBlockLowlight.configure({
                lowlight: lowlight
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
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
            {!isReadonly && <div className="flex justify-between border border-white mb-5 cols-3 grid grid-cols-8 gap-2 sticky top-0 z-10 bg-white">
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
                <button
                    onClick={() => editor.chain().focus().setFontFamily('Inter').run()}
                    className={editor.isActive('textStyle', { fontFamily: 'Inter' }) ? 'is-active' : ''}
                    data-test-id="inter"
                >
                    Inter
                </button>
                <button
                    onClick={() => editor.chain().focus().setFontFamily('Comic Sans MS, Comic Sans').run()}
                    className={
                        editor.isActive('textStyle', { fontFamily: 'Comic Sans MS, Comic Sans' })
                            ? 'is-active'
                            : ''
                    }
                    data-test-id="comic-sans"
                >
                    Comic Sans
                </button>
                <button
                    onClick={() => editor.chain().focus().setFontFamily('serif').run()}
                    className={editor.isActive('textStyle', { fontFamily: 'serif' }) ? 'is-active' : ''}
                    data-test-id="serif"
                >
                    Serif
                </button>
                <button
                    onClick={() => editor.chain().focus().setFontFamily('monospace').run()}
                    className={editor.isActive('textStyle', { fontFamily: 'monospace' }) ? 'is-active' : ''}
                    data-test-id="monospace"
                >
                    Monospace
                </button>
            </div>}
            {editor && <BubbleMenu editor={editor} shouldShow={({ state, from }) => {
                const $pos = state.doc.resolve(from)
                const node = $pos.node($pos.depth);
                return false //TODO: Remove this line if you want the bubbleMenu to work
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