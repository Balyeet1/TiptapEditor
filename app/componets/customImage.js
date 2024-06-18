"use client"

import "@/app/globals.css";
import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { NodeViewWrapper } from '@tiptap/react'

const CustomImage = Node.create({
    name: 'customImage',

    inline: false,
    group: 'block',
    draggable: true,

    addAttributes() {
        return {
            src: { default: null },
            alt: { default: null },
            title: { default: null },
            width: { default: 'auto' },
            alignment: { default: 'center' },
        }
    },

    parseHTML() {
        return [{ tag: 'img[src]' }]
    },

    renderHTML({ HTMLAttributes }) {
        return ['img', mergeAttributes(HTMLAttributes)]
    },

    addNodeView() {
        return ReactNodeViewRenderer(({ node, updateAttributes }) => {
            const { src, alt, title, width, alignment } = node.attrs
            return (
                <NodeViewWrapper>
                    <NodeViewWrapper className="flex flex-col items-center"></NodeViewWrapper>
                    <div style={{ justifyContent: alignment }} className={`w-full flex`}>
                        <img
                            src={src}
                            alt={alt}
                            title={title}
                            style={{ width }}
                        />
                    </div>
                    <div className="mt-2 flex space-x-2">
                        <input
                            type="text"
                            value={width}
                            placeholder="Width"
                            onChange={(e) => updateAttributes({ width: e.target.value })}
                            className="border rounded p-1 text-black"
                        />
                        <select
                            value={alignment}
                            onChange={(e) => updateAttributes({ alignment: e.target.value })}
                            className="border rounded p-1 text-black"
                        >
                            <option value="start">Left</option>
                            <option value="center">Center</option>
                            <option value="end">Right</option>
                        </select>
                    </div>
                </NodeViewWrapper>
            )
        })
    },
    addCommands() {
        return {
            setImage: (attrs) => ({ commands }) => {
                return commands.insertContent({
                    type: 'customImage',
                    attrs,
                });
            },
        };
    },
})

export default CustomImage