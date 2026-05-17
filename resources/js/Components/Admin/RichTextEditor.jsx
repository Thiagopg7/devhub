import { useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

const ToolbarButton = ({ onClick, active, title, children }) => (
    <button
        type="button"
        onMouseDown={(e) => {
            e.preventDefault();
            onClick();
        }}
        title={title}
        className={`px-2 py-1 rounded text-sm cursor-pointer border-none transition-colors ${
            active
                ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold"
                : "bg-transparent hover:bg-gray-200 dark:hover:bg-gray-600 font-normal dark:text-gray-300"
        }`}
    >
        {children}
    </button>
);

const Divider = () => (
    <span className="inline-block w-px h-5 bg-gray-200 dark:bg-gray-500 mx-1 self-center" />
);

export default function RichTextEditor({
    label,
    value,
    onChange,
    readOnly = false,
}) {
    const [showHTML, setShowHTML] = useState(false);
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextStyle,
            Color,
            Highlight.configure({ multicolor: true }),
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Link.configure({ openOnClick: false }),
            Image,
        ],
        content: value || "",
        editable: !readOnly,
        onUpdate({ editor }) {
            onChange(editor.getHTML());
        },
    });
    const setLink = useCallback(() => {
        const url = window.prompt("URL do link:");
        if (!url) return;
        editor.chain().focus().setLink({ href: url }).run();
    }, [editor]);
    const addImage = useCallback(() => {
        const url = window.prompt("URL da imagem:");
        if (url) editor.chain().focus().setImage({ src: url }).run();
    }, [editor]);
    if (!editor) return null;
    return (
        <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-3 py-2 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                {label && (
                    <span className="font-medium text-sm dark:text-gray-100">
                        {label}
                    </span>
                )}
                <button
                    type="button"
                    onClick={() => setShowHTML(!showHTML)}
                    className="px-2.5 py-0.5 text-xs rounded border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-600 dark:text-gray-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
                >
                    {showHTML ? "Visualizar Editor" : "Visualizar HTML"}
                </button>
            </div>

            {!showHTML ? (
                <>
                    {/* Toolbar */}
                    {!readOnly && (
                        <div className="flex flex-wrap gap-0.5 px-2 py-1.5 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 items-center">
                            {/* Heading */}
                            <select
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === "0")
                                        editor
                                            .chain()
                                            .focus()
                                            .setParagraph()
                                            .run();
                                    else
                                        editor
                                            .chain()
                                            .focus()
                                            .toggleHeading({
                                                level: parseInt(val),
                                            })
                                            .run();
                                }}
                                className="text-xs rounded border border-gray-300 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-200 px-1 py-0.5"
                            >
                                <option value="0">Parágrafo</option>
                                <option value="1">H1</option>
                                <option value="2">H2</option>
                                <option value="3">H3</option>
                                <option value="4">H4</option>
                                <option value="5">H5</option>
                                <option value="6">H6</option>
                            </select>
                            <Divider />
                            <ToolbarButton
                                onClick={() =>
                                    editor.chain().focus().toggleBold().run()
                                }
                                active={editor.isActive("bold")}
                                title="Negrito"
                            >
                                <b>B</b>
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={() =>
                                    editor.chain().focus().toggleItalic().run()
                                }
                                active={editor.isActive("italic")}
                                title="Itálico"
                            >
                                <i>I</i>
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleUnderline()
                                        .run()
                                }
                                active={editor.isActive("underline")}
                                title="Sublinhado"
                            >
                                <u>U</u>
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={() =>
                                    editor.chain().focus().toggleStrike().run()
                                }
                                active={editor.isActive("strike")}
                                title="Tachado"
                            >
                                <s>S</s>
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={() =>
                                    editor.chain().focus().toggleCode().run()
                                }
                                active={editor.isActive("code")}
                                title="Código inline"
                            >
                                {"</>"}
                            </ToolbarButton>
                            <Divider />
                            {/* Cor do texto */}
                            <label
                                title="Cor do texto"
                                className="flex items-center gap-0.5 text-xs cursor-pointer dark:text-gray-300"
                            >
                                A
                                <input
                                    type="color"
                                    onChange={(e) =>
                                        editor
                                            .chain()
                                            .focus()
                                            .setColor(e.target.value)
                                            .run()
                                    }
                                    className="w-4 h-4 border-none cursor-pointer p-0 bg-transparent"
                                />
                            </label>
                            <Divider />
                            <ToolbarButton
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .setTextAlign("left")
                                        .run()
                                }
                                active={editor.isActive({ textAlign: "left" })}
                                title="Alinhar esquerda"
                            >
                                ≡
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .setTextAlign("center")
                                        .run()
                                }
                                active={editor.isActive({
                                    textAlign: "center",
                                })}
                                title="Centralizar"
                            >
                                ≡
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .setTextAlign("right")
                                        .run()
                                }
                                active={editor.isActive({ textAlign: "right" })}
                                title="Alinhar direita"
                            >
                                ≡
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .setTextAlign("justify")
                                        .run()
                                }
                                active={editor.isActive({
                                    textAlign: "justify",
                                })}
                                title="Justificar"
                            >
                                ≡
                            </ToolbarButton>
                            <Divider />
                            <ToolbarButton
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleBulletList()
                                        .run()
                                }
                                active={editor.isActive("bulletList")}
                                title="Lista com marcadores"
                            >
                                • Lista
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleOrderedList()
                                        .run()
                                }
                                active={editor.isActive("orderedList")}
                                title="Lista numerada"
                            >
                                1. Lista
                            </ToolbarButton>
                            <Divider />
                            <ToolbarButton
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleBlockquote()
                                        .run()
                                }
                                active={editor.isActive("blockquote")}
                                title="Citação"
                            >
                                "
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleCodeBlock()
                                        .run()
                                }
                                active={editor.isActive("codeBlock")}
                                title="Bloco de código"
                            >
                                {"{ }"}
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={setLink}
                                active={editor.isActive("link")}
                                title="Link"
                            >
                                🔗
                            </ToolbarButton>
                            <ToolbarButton onClick={addImage} title="Imagem">
                                🖼
                            </ToolbarButton>
                            <Divider />
                            <ToolbarButton
                                onClick={() =>
                                    editor.chain().focus().undo().run()
                                }
                                title="Desfazer"
                            >
                                ↩
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={() =>
                                    editor.chain().focus().redo().run()
                                }
                                title="Refazer"
                            >
                                ↪
                            </ToolbarButton>
                        </div>
                    )}
                    {/* Editor */}
                    <div className="bg-white dark:bg-gray-700 dark:text-gray-100 [&_.tiptap]:outline-none [&_.tiptap]:min-h-[200px] [&_.tiptap]:p-4">
                        <EditorContent editor={editor} />
                    </div>
                </>
            ) : (
                <textarea
                    className="w-full font-mono text-sm resize-y bg-white dark:bg-gray-700 dark:text-gray-100 border-none outline-none p-3"
                    style={{ minHeight: 200, boxSizing: "border-box" }}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    readOnly={readOnly}
                />
            )}
        </div>
    );
}
