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
            float: { default: "none" }
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
            const { src, alt, title, width, alignment, float } = node.attrs

            const menuRef = useRef(null);
            const [showMenu, setShowMenu] = useState(false);
            const imageRef = useRef(null);

            const handleImageClick = (e) => {
                setShowMenu(true);
            };

            useEffect(() => {
                const handleClickOutside = (event) => {
                    if (imageRef.current && !imageRef.current.contains(event.target) && !event.target.closest("#image-menu")) {
                        setShowMenu(false);
                    }

                };
                document.addEventListener("mousedown", handleClickOutside);
                return () => {
                    document.removeEventListener("mousedown", handleClickOutside);
                };
            }, []);

            const style = {
                float,
                width,
                ...(float === 'none' && {
                    marginLeft: alignment === "start" ? "0px" : "auto",
                    marginRight: alignment === "end" ? "0px" : "auto"
                })
            };

            return (
                <NodeViewWrapper
                    style={style}
                    data-drag-handle
                    className={clsx(
                        `flex justify-center relative max-w-full min-w-0`,
                        {
                            "mr-5": float == "left",
                            "ml-": float == "right"
                        }
                    )}
                >
                    <img
                        src={src}
                        alt={alt}
                        title={title}
                        onClick={handleImageClick}
                        ref={imageRef}
                        className={clsx(
                            'hover:border-3',
                            'hover:border-blue-500',
                            'block w-full',
                            {
                                'border-blue-500 border-3': showMenu
                            }
                        )}
                    />
                    {showMenu && (
                        <div
                            className="absolute bg-white border shadow-md rounded-md p-1"
                            style={{ top: "-1rem" }}
                            ref={menuRef}
                            id="image-menu"
                        >
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={width}
                                    placeholder="Width"
                                    onChange={(e) => updateAttributes({ width: e.target.value })}
                                    className="border rounded p-1 text-black w-10"
                                />
                                <select
                                    value={alignment}
                                    onChange={(e) => {
                                        updateAttributes({ alignment: e.target.value, float: "none" })
                                    }}
                                    className="border rounded p-1 text-black"
                                >
                                    <option value="start">Left</option>
                                    <option value="center">Center</option>
                                    <option value="end">Right</option>
                                </select>
                                <input
                                    type="checkbox"
                                    checked={float === "left"}
                                    onChange={(e) => updateAttributes({ float: float === "left" ? "none" : "left" })}
                                />Left
                                <input
                                    type="checkbox"
                                    checked={float === "right"}
                                    onChange={(e) => updateAttributes({ float: float === "right" ? "none" : "right" })}
                                />Right
                            </div>
                        </div>
                    )}
                </NodeViewWrapper >
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