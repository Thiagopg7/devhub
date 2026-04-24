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
        style={{
            padding: "4px 8px",
            borderRadius: 4,
            border: "none",
            cursor: "pointer",
            fontWeight: active ? 700 : 400,
            background: active ? "#dbeafe" : "transparent",
            color: active ? "#1d4ed8" : "inherit",
            fontSize: 13,
        }}
    >
        {" "}
        {children}{" "}
    </button>
);
const Divider = () => (
    <span
        style={{
            width: 1,
            height: 20,
            background: "#e5e7eb",
            margin: "0 4px",
            display: "inline-block",
        }}
    />
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
        <div
            style={{
                border: "1px solid #d1d5db",
                borderRadius: 8,
                overflow: "hidden",
            }}
        >
            {" "}
            {/* Header */}{" "}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 12px",
                    borderBottom: "1px solid #e5e7eb",
                    background: "#f9fafb",
                }}
            >
                {" "}
                {label && (
                    <span style={{ fontWeight: 500, fontSize: 14 }}>
                        {label}
                    </span>
                )}{" "}
                <button
                    type="button"
                    onClick={() => setShowHTML(!showHTML)}
                    style={{
                        padding: "3px 10px",
                        fontSize: 12,
                        borderRadius: 4,
                        border: "1px solid #d1d5db",
                        background: "white",
                        cursor: "pointer",
                    }}
                >
                    {" "}
                    {showHTML ? "Visualizar Editor" : "Visualizar HTML"}{" "}
                </button>{" "}
            </div>{" "}
            {!showHTML ? (
                <>
                    {" "}
                    {/* Toolbar */}{" "}
                    {!readOnly && (
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 2,
                                padding: "6px 8px",
                                borderBottom: "1px solid #e5e7eb",
                                background: "#f9fafb",
                            }}
                        >
                            {" "}
                            {/* Heading */}{" "}
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
                                style={{
                                    fontSize: 12,
                                    borderRadius: 4,
                                    border: "1px solid #d1d5db",
                                    padding: "2px 4px",
                                }}
                            >
                                {" "}
                                <option value="0">Parágrafo</option>{" "}
                                <option value="1">H1</option>{" "}
                                <option value="2">H2</option>{" "}
                                <option value="3">H3</option>{" "}
                                <option value="4">H4</option>{" "}
                                <option value="5">H5</option>{" "}
                                <option value="6">H6</option>{" "}
                            </select>{" "}
                            <Divider />{" "}
                            <ToolbarButton
                                onClick={() =>
                                    editor.chain().focus().toggleBold().run()
                                }
                                active={editor.isActive("bold")}
                                title="Negrito"
                            >
                                <b>B</b>
                            </ToolbarButton>{" "}
                            <ToolbarButton
                                onClick={() =>
                                    editor.chain().focus().toggleItalic().run()
                                }
                                active={editor.isActive("italic")}
                                title="Itálico"
                            >
                                <i>I</i>
                            </ToolbarButton>{" "}
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
                            </ToolbarButton>{" "}
                            <ToolbarButton
                                onClick={() =>
                                    editor.chain().focus().toggleStrike().run()
                                }
                                active={editor.isActive("strike")}
                                title="Tachado"
                            >
                                <s>S</s>
                            </ToolbarButton>{" "}
                            <ToolbarButton
                                onClick={() =>
                                    editor.chain().focus().toggleCode().run()
                                }
                                active={editor.isActive("code")}
                                title="Código inline"
                            >
                                {"</>"}
                            </ToolbarButton>{" "}
                            <Divider /> {/* Cor do texto */}{" "}
                            <label
                                title="Cor do texto"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    cursor: "pointer",
                                    gap: 2,
                                    fontSize: 12,
                                }}
                            >
                                {" "}
                                A{" "}
                                <input
                                    type="color"
                                    onChange={(e) =>
                                        editor
                                            .chain()
                                            .focus()
                                            .setColor(e.target.value)
                                            .run()
                                    }
                                    style={{
                                        width: 18,
                                        height: 18,
                                        border: "none",
                                        cursor: "pointer",
                                        padding: 0,
                                    }}
                                />{" "}
                            </label>{" "}
                            <Divider />{" "}
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
                            </ToolbarButton>{" "}
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
                            </ToolbarButton>{" "}
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
                            </ToolbarButton>{" "}
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
                            </ToolbarButton>{" "}
                            <Divider />{" "}
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
                            </ToolbarButton>{" "}
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
                            </ToolbarButton>{" "}
                            <Divider />{" "}
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
                            </ToolbarButton>{" "}
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
                            </ToolbarButton>{" "}
                            <ToolbarButton
                                onClick={setLink}
                                active={editor.isActive("link")}
                                title="Link"
                            >
                                🔗
                            </ToolbarButton>{" "}
                            <ToolbarButton onClick={addImage} title="Imagem">
                                🖼
                            </ToolbarButton>{" "}
                            <Divider />{" "}
                            <ToolbarButton
                                onClick={() =>
                                    editor.chain().focus().undo().run()
                                }
                                title="Desfazer"
                            >
                                ↩
                            </ToolbarButton>{" "}
                            <ToolbarButton
                                onClick={() =>
                                    editor.chain().focus().redo().run()
                                }
                                title="Refazer"
                            >
                                ↪
                            </ToolbarButton>{" "}
                        </div>
                    )}{" "}
                    {/* Editor */}{" "}
                    <EditorContent
                        editor={editor}
                        style={{
                            padding: "12px 16px",
                            minHeight: 200,
                            outline: "none",
                        }}
                    />{" "}
                </>
            ) : (
                <textarea
                    style={{
                        width: "100%",
                        minHeight: 200,
                        padding: 12,
                        border: "none",
                        fontFamily: "monospace",
                        fontSize: 13,
                        resize: "vertical",
                        boxSizing: "border-box",
                    }}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    readOnly={readOnly}
                />
            )}{" "}
        </div>
    );
}
