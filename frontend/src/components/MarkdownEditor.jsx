import { useRef } from "react";
import ReactMarkdown from "react-markdown";

function MarkdownEditor({ content, setContent }) {
  const textareaRef = useRef(null);

  const wrapSelection = (sign) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = (content || "").slice(start, end);
    let newText;

    if (sign.includes("#") || sign === "- " || sign === "> ") {
      const lines = (content || "").split("\n");
      let charCount = 0;
      newText = lines
        .map((line) => {
          const lineStart = charCount;
          const lineEnd = charCount + line.length;
          charCount += line.length + 1;

          if (lineEnd >= start && lineStart <= end) {
            return sign + line;
          }
          return line;
        })
        .join("\n");
    } else {
      newText = (content || "").slice(0, start) + sign + selected + sign + (content || "").slice(end);
    }

    setContent(newText);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursorPos = start + sign.length;
      textarea.setSelectionRange(cursorPos, cursorPos + selected.length);
    });
  };

  return (
    <div className="mt-5">
      <div className="flex justify-center gap-20 mb-5 p-2 shadow-[1px_1px_3px_grey] rounded-[7px]">
        <select
          className="font-semibold"
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) wrapSelection(e.target.value);
            e.target.value = "";
          }}
        >
          <option value="">Select the heading</option>
          <option value="# ">Heading 1</option>
          <option value="## ">Heading 2</option>
          <option value="### ">Heading 3</option>
          <option value="#### ">Heading 4</option>
        </select>

        <button className="font-semibold" type="button" onClick={() => wrapSelection("- ")}>
          List
        </button>
        <button className="font-semibold" type="button" onClick={() => wrapSelection("**")}>
          Bold
        </button>
        <button className="font-semibold" type="button" onClick={() => wrapSelection("*")}>
          Italic
        </button>
        <button className="font-semibold" type="button" onClick={() => wrapSelection("`")}>
          Code
        </button>
        <button className="font-semibold" type="button" onClick={() => wrapSelection("> ")}>
          Block Quote
        </button>
      </div>

      <div className="flex">
        <textarea
          ref={textareaRef}
          className="w-[600px] shadow-[1px_2px_6px_grey] p-2 focus:outline-none mr-2 min-h-[280px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post in Markdown..."
        />

        <div className="w-[600px] p-4 shadow-[1px_2px_6px_grey] bg-gray-50 prose min-h-[200px]">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export default MarkdownEditor;
