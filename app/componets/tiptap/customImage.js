import { Node, mergeAttributes, PasteRule } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react'
import { NodeViewWrapper } from '@tiptap/react'
import { useState, useRef, useEffect } from "react";
import clsx from 'clsx';


const getImageExtension = (isReadonly) => {

    const editable = !isReadonly;

    const CustomImage = Node.create({
        name: 'customImage',
        inline: false,
        group: 'block',
        draggable: true,
        atom: true,

        addAttributes() {
            return {
                src: { default: null },
                alt: { default: null },
                title: { default: null },
                width: { default: '100%' },
                alignment: { default: 'center' },
                float: { default: "none" },
            }
        },

        parseHTML() {
            return [{ tag: 'img[src]' }]
        },

        renderHTML({ HTMLAttributes }) {
            return ['img', mergeAttributes(HTMLAttributes)]
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

        addPasteRules() {
            return [
                new PasteRule({
                    find: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*\.(jpe?g|png|gif|bmp|webp|svg)$/gi,
                    handler: ({ state, range, match }) => {
                        const imageNode = this.type.create({ src: match[0] });
                        return state.tr.replaceRangeWith(range.from, range.to, imageNode);
                    },
                }),
            ];
        },

        addNodeView() {
            return ReactNodeViewRenderer(({ node, updateAttributes }) => {
                const { src, alt, title, width, alignment, float } = node.attrs

                const menuRef = useRef(null);
                const [showMenu, setShowMenu] = useState(false);
                const imageRef = useRef(null);

                const handleImageClick = () => {
                    if (editable) setShowMenu(true);
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

                const changableStyle = {
                    float,
                    width,
                    ...(float === 'none' && {
                        marginLeft: alignment === "start" ? "0px" : "auto",
                        marginRight: alignment === "end" ? "0px" : "auto"
                    })
                };

                return (
                    <NodeViewWrapper
                        style={changableStyle}
                        data-drag-handle
                        className={clsx(
                            `flex justify-center relative max-w-full min-w-0`,
                            {
                                "mr-5": float == "left",
                                "ml-5": float == "right"
                            }
                        )}
                    >
                        <img
                            src={src}
                            alt={alt}
                            title={title}
                            onClick={handleImageClick}
                            ref={imageRef}
                            className={
                                !editable ? "block w-full"
                                    : clsx(
                                        'hover:border-3',
                                        'hover:border-blue-500',
                                        'block w-full',
                                        {
                                            'border-blue-500 border-3': showMenu
                                        }
                                    )}
                        />
                        <ImageMenu
                            node={node}
                            updateAttributes={updateAttributes}
                            showMenu={showMenu}
                            menuRef={menuRef}
                        />

                    </NodeViewWrapper >
                )
            })
        },
    })

    const ImageMenu = ({ node, updateAttributes, showMenu, menuRef }) => {
        const { width, alignment, float } = node.attrs;

        if (!showMenu) return null;

        const handleAlignmentChange = (e) => {
            updateAttributes({ alignment: e.target.value, float: "none" });
        };

        const handleFloatChange = (side) => (e) => {
            updateAttributes({ float: e.target.checked ? side : "none" });
        };

        return (
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

                    <select value={alignment} onChange={handleAlignmentChange} className="border rounded p-1 text-black">
                        <option value="start">Left</option>
                        <option value="center">Center</option>
                        <option value="end">Right</option>
                    </select>

                    <input type="checkbox" checked={float === "left"} onChange={handleFloatChange("left")} />
                    <strong className="text-black">Left</strong>

                    <input type="checkbox" checked={float === "right"} onChange={handleFloatChange("right")} />
                    <strong className="text-black">Right</strong>
                </div>
            </div>
        );
    };

    return CustomImage
}

export default getImageExtension 