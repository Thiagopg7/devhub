import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ font: [] }, { size: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["link", "image", "video"],
    ["clean"],
  ],
};

const formats = [
  "header", "font", "size",
  "bold", "italic", "underline", "strike", "blockquote", "code-block",
  "color", "background",
  "list", "indent", "align",
  "link", "image", "video",
];

export default function RichTextEditor({ label, value, onChange, readOnly = false }) {
  const [showHTML, setShowHTML] = useState(false);

  return (
    <div>
      <div className="flex justify-between mb-2">
        {label && <h3 className="mb-2">{label}</h3>}
        <button
          type="button"
          onClick={() => setShowHTML(!showHTML)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          {showHTML ? "Visualizar Editor" : "Visualizar HTML"}
        </button>
      </div>

      {!showHTML ? (
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          style={{ minHeight: "200px" }}
          readOnly={readOnly}
        />
      ) : (
        <textarea
          className="w-full h-40 p-2 border rounded"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
        />
      )}
    </div>
  );
}
