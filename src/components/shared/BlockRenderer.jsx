import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";

function CodeBlock({ content, language }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const langMap = { tcl: "tcl", python: "python", bash: "bash", verilog: "verilog", systemverilog: "verilog", shell: "bash", c: "c", vhdl: "vhdl" };

  return (
    <div className="relative group my-6 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
        <span className="font-mono text-[10px] uppercase tracking-widest text-blue-600 font-semibold">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          data-testid="copy-code-button"
          className="flex items-center gap-1 text-xs font-mono text-gray-600 hover:text-blue-600 transition-colors"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "COPIED" : "COPY"}
        </button>
      </div>
      <SyntaxHighlighter
        language={langMap[language?.toLowerCase()] || "text"}
        style={oneLight}
        customStyle={{
          margin: 0,
          padding: "1rem",
          background: "#fafafa",
          fontSize: "0.85rem",
          lineHeight: "1.6",
        }}
        showLineNumbers={true}
        lineNumberStyle={{ color: "#94a3b8", fontSize: "0.75rem" }}
      >
        {content}
      </SyntaxHighlighter>
    </div>
  );
}

function ImageBlock({ url, caption }) {
  return (
    <figure className="my-6">
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md">
        <img src={url} alt={caption || ""} className="w-full h-auto object-cover" loading="lazy" />
      </div>
      {caption && (
        <figcaption className="mt-2 text-sm text-gray-600 font-mono text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function YouTubeBlock({ url }) {
  const getVideoId = (u) => {
    const match = u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };
  const videoId = getVideoId(url || "");
  if (!videoId) return null;

  return (
    <div className="my-6 relative rounded-lg overflow-hidden border border-gray-200 shadow-md" style={{ paddingBottom: "56.25%" }}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video"
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

export default function BlockRenderer({ blocks }) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="prose-custom">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p 
                key={index} 
                className="text-gray-700 leading-relaxed text-base font-body mb-4 whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: block.content }}
              />
            );
            
          case "heading":
            if (block.level === 3) {
              return (
                <h3 key={index} className="font-heading text-xl font-semibold text-gray-900 mt-8 mb-3">
                  {block.content}
                </h3>
              );
            }
            return (
              <h2 key={index} className="font-heading text-2xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b-2 border-blue-200">
                {block.content}
              </h2>
            );
            
          case "list":
            const ListTag = block.listType === 'ol' ? 'ol' : 'ul';
            const listClass = block.listType === 'ol' ? 'list-decimal' : 'list-disc';
            const items = (block.content || "").split('\n').filter(item => item.trim() !== '');
            
            return (
              <ListTag key={index} className={`space-y-2 my-4 pl-6 ${listClass} text-gray-700 font-body marker:text-blue-600`}>
                {items.map((item, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ListTag>
            );
            
          case "code":
            return <CodeBlock key={index} content={block.content} language={block.language} />;
            
          case "image":
            return <ImageBlock key={index} url={block.url} caption={block.caption} />;
            
          case "youtube":
            return <YouTubeBlock key={index} url={block.url} />;
            
          default:
            return null;
        }
      })}
    </div>
  );
}