"use client"

import "@/app/globals.css";
import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { NodeViewWrapper } from '@tiptap/react'
import { useState, useRef, useEffect } from "react";
import clsx from 'clsx';

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
            width: { default: '100%' },
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

            const [showMenu, setShowMenu] = useState(false);
            const imageRef = useRef(null);


            const handleImageClick = (e) => {
                setShowMenu(true);
            };

            useEffect(() => {
                const handleClickOutside = (event) => {
                    console.log()
                    if (imageRef.current && !imageRef.current.contains(event.target) && !event.target.closest("#image-menu")) {
                        setShowMenu(false);
                    }

                };
                document.addEventListener("mousedown", handleClickOutside);
                return () => {
                    document.removeEventListener("mousedown", handleClickOutside);
                };
            }, []);

            return (
                <NodeViewWrapper>
                    <div className="relative">
                        <div style={{ justifyContent: alignment }} className={`w-full flex`}>
                            <img
                                src={src}
                                alt={alt}
                                title={title}
                                style={{ width }}
                                onClick={handleImageClick}
                                ref={imageRef}
                                className={clsx(
                                    'border-3',
                                    'hover:border-blue-500',
                                    {
                                        'border-blue-500': showMenu
                                    }
                                )}
                            />
                            {showMenu && (
                                <div
                                    className="absolute bg-white border shadow-md rounded-md p-1"
                                    style={{ top: "-1rem" }}
                                    id="image-menu"
                                >
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            value={width}
                                            placeholder="Width"
                                            onChange={(e) => updateAttributes({ width: e.target.value })}
                                            className="border rounded p-1 text-black w-10"
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
                                </div>
                            )}
                        </div>
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