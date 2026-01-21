import { cn } from "@/lib/utils";
import type { NotionBlock, RichTextSegment } from "@/lib/notion/queries";
import { FileText, ExternalLink, CheckSquare, Square, Download, List } from "lucide-react";

interface NotionContentProps {
  blocks: NotionBlock[];
  className?: string;
}

// Helper to render rich text with links and formatting
function RichTextRenderer({ segments }: { segments?: RichTextSegment[] }) {
  if (!segments || segments.length === 0) return null;

  return (
    <>
      {segments.map((segment, index) => {
        let content: React.ReactNode = segment.text;

        // Apply formatting
        if (segment.annotations?.code) {
          content = (
            <code className="px-1.5 py-0.5 bg-gray-100 rounded text-sm font-mono text-pink-600">
              {content}
            </code>
          );
        }
        if (segment.annotations?.bold) {
          content = <strong>{content}</strong>;
        }
        if (segment.annotations?.italic) {
          content = <em>{content}</em>;
        }
        if (segment.annotations?.strikethrough) {
          content = <s>{content}</s>;
        }
        if (segment.annotations?.underline) {
          content = <u>{content}</u>;
        }

        // Wrap in link if href exists
        if (segment.href) {
          // Check if it's an internal anchor link (starts with #)
          const isInternalAnchor = segment.href.startsWith("#") || segment.href.includes("/#");

          return (
            <a
              key={index}
              href={segment.href}
              className="text-primary-600 hover:text-primary-700 underline"
              {...(!isInternalAnchor && { target: "_blank", rel: "noopener noreferrer" })}
            >
              {content}
            </a>
          );
        }

        return <span key={index}>{content}</span>;
      })}
    </>
  );
}

export function NotionContent({ blocks, className }: NotionContentProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  // Group consecutive list items
  const groupedBlocks: (NotionBlock | NotionBlock[])[] = [];
  let currentList: NotionBlock[] = [];
  let currentListType: string | null = null;

  blocks.forEach((block, index) => {
    const isListItem = block.type === "bulleted_list_item" || block.type === "numbered_list_item";

    if (isListItem) {
      if (currentListType === block.type) {
        currentList.push(block);
      } else {
        if (currentList.length > 0) {
          groupedBlocks.push([...currentList]);
        }
        currentList = [block];
        currentListType = block.type;
      }
    } else {
      if (currentList.length > 0) {
        groupedBlocks.push([...currentList]);
        currentList = [];
        currentListType = null;
      }
      groupedBlocks.push(block);
    }
  });

  if (currentList.length > 0) {
    groupedBlocks.push(currentList);
  }

  return (
    <div className={cn("prose prose-gray max-w-none", className)}>
      {groupedBlocks.map((item, index) => {
        if (Array.isArray(item)) {
          // Render list
          const listType = item[0].type;
          const ListTag = listType === "numbered_list_item" ? "ol" : "ul";
          return (
            <ListTag key={index} className={cn(
              "my-4 pl-6",
              listType === "numbered_list_item" ? "list-decimal" : "list-disc"
            )}>
              {item.map((listItem) => (
                <li key={listItem.id} className="text-gray-700 py-0.5">
                  {listItem.richText ? <RichTextRenderer segments={listItem.richText} /> : listItem.content}
                </li>
              ))}
            </ListTag>
          );
        }

        return <NotionBlockRenderer key={item.id} block={item} allBlocks={blocks} />;
      })}
    </div>
  );
}

function NotionBlockRenderer({ block, allBlocks }: { block: NotionBlock; allBlocks?: NotionBlock[] }) {
  // Helper to generate slug for headings (for anchor links)
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  switch (block.type) {
    case "paragraph":
      if (!block.content && (!block.richText || block.richText.length === 0)) return <div className="h-4" />;
      return (
        <p className="text-gray-700 leading-relaxed my-3">
          {block.richText ? <RichTextRenderer segments={block.richText} /> : block.content}
        </p>
      );

    case "heading_1":
      const h1Slug = generateSlug(block.content);
      return (
        <h1 id={h1Slug} className="text-2xl font-bold text-gray-900 mt-8 mb-4 first:mt-0 scroll-mt-20">
          {block.richText ? <RichTextRenderer segments={block.richText} /> : block.content}
        </h1>
      );

    case "heading_2":
      const h2Slug = generateSlug(block.content);
      return (
        <h2 id={h2Slug} className="text-xl font-semibold text-gray-900 mt-6 mb-3 first:mt-0 scroll-mt-20">
          {block.richText ? <RichTextRenderer segments={block.richText} /> : block.content}
        </h2>
      );

    case "heading_3":
      const h3Slug = generateSlug(block.content);
      return (
        <h3 id={h3Slug} className="text-lg font-medium text-gray-900 mt-5 mb-2 first:mt-0 scroll-mt-20">
          {block.richText ? <RichTextRenderer segments={block.richText} /> : block.content}
        </h3>
      );

    case "to_do":
      return (
        <div className="flex items-start gap-2 my-2">
          <Square className="w-4 h-4 mt-1 text-gray-400 flex-shrink-0" />
          <span className="text-gray-700">
            {block.richText ? <RichTextRenderer segments={block.richText} /> : block.content}
          </span>
        </div>
      );

    case "to_do_checked":
      return (
        <div className="flex items-start gap-2 my-2">
          <CheckSquare className="w-4 h-4 mt-1 text-green-500 flex-shrink-0" />
          <span className="text-gray-500 line-through">
            {block.richText ? <RichTextRenderer segments={block.richText} /> : block.content}
          </span>
        </div>
      );

    case "toggle":
      return (
        <details className="my-3 group">
          <summary className="cursor-pointer text-gray-700 font-medium hover:text-gray-900">
            {block.richText ? <RichTextRenderer segments={block.richText} /> : block.content}
          </summary>
          {block.children && (
            <div className="pl-4 mt-2 border-l-2 border-gray-200">
              <NotionContent blocks={block.children} />
            </div>
          )}
        </details>
      );

    case "code":
      return (
        <div className="my-4">
          <div className="bg-gray-900 rounded-t-lg px-4 py-2 text-xs text-gray-400">
            {block.caption || "Code"}
          </div>
          <pre className="bg-gray-900 rounded-b-lg p-4 overflow-x-auto">
            <code className="text-sm text-gray-100 font-mono">{block.content}</code>
          </pre>
        </div>
      );

    case "quote":
      return (
        <blockquote className="border-l-4 border-primary-500 pl-4 py-2 my-4 italic text-gray-600">
          {block.richText ? <RichTextRenderer segments={block.richText} /> : block.content}
        </blockquote>
      );

    case "callout":
      return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
          <p className="text-blue-800">
            {block.richText ? <RichTextRenderer segments={block.richText} /> : block.content}
          </p>
        </div>
      );

    case "table_of_contents":
      // Generate table of contents from heading blocks
      if (!allBlocks) return null;
      const headings = allBlocks.filter(b =>
        b.type === "heading_1" || b.type === "heading_2" || b.type === "heading_3"
      );
      if (headings.length === 0) return null;
      return (
        <nav className="my-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700">
            <List className="w-4 h-4" />
            Sommaire
          </div>
          <ul className="space-y-1">
            {headings.map((heading) => {
              const slug = generateSlug(heading.content);
              const indent = heading.type === "heading_2" ? "pl-4" : heading.type === "heading_3" ? "pl-8" : "";
              return (
                <li key={heading.id} className={indent}>
                  <a
                    href={`#${slug}`}
                    className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    {heading.content}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      );

    case "table":
      // Table block - children are table_row blocks
      if (!block.children || block.children.length === 0) return null;
      const hasColumnHeader = block.hasColumnHeader;
      const hasRowHeader = block.hasRowHeader;
      return (
        <div className="my-4 overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200 rounded-lg">
            <tbody>
              {block.children.map((row, rowIndex) => {
                if (row.type !== "table_row" || !row.cells) return null;
                const isHeaderRow = hasColumnHeader && rowIndex === 0;
                const CellTag = isHeaderRow ? "th" : "td";
                return (
                  <tr
                    key={row.id}
                    className={cn(
                      isHeaderRow ? "bg-gray-50" : rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    )}
                  >
                    {row.cells.map((cell, cellIndex) => {
                      const isHeaderCell = isHeaderRow || (hasRowHeader && cellIndex === 0);
                      const ActualCellTag = isHeaderCell ? "th" : CellTag;
                      return (
                        <ActualCellTag
                          key={cellIndex}
                          className={cn(
                            "border border-gray-200 px-4 py-2 text-sm",
                            isHeaderCell
                              ? "font-semibold text-gray-900 bg-gray-50"
                              : "text-gray-700"
                          )}
                        >
                          <RichTextRenderer segments={cell} />
                        </ActualCellTag>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );

    case "table_row":
      // Table rows are handled by the table block
      return null;

    case "divider":
      return <hr className="my-6 border-gray-200" />;

    case "image":
      if (!block.url) return null;
      return (
        <figure className="my-6">
          <img
            src={block.url}
            alt={block.caption || "Image"}
            className="rounded-lg max-w-full h-auto shadow-sm"
          />
          {block.caption && (
            <figcaption className="text-center text-sm text-gray-500 mt-2">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case "video":
      if (!block.url) return null;
      return (
        <figure className="my-6">
          <video
            src={block.url}
            controls
            className="rounded-lg max-w-full shadow-sm"
          />
          {block.caption && (
            <figcaption className="text-center text-sm text-gray-500 mt-2">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case "file":
      if (!block.url) return null;
      return (
        <a
          href={block.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 my-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors group"
        >
          <div className="p-2 bg-white rounded-lg border border-gray-200">
            <Download className="w-5 h-5 text-gray-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{block.content}</p>
            {block.caption && (
              <p className="text-sm text-gray-500 truncate">{block.caption}</p>
            )}
          </div>
          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
        </a>
      );

    case "bookmark":
    case "embed":
      if (!block.url) return null;
      return (
        <a
          href={block.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-4 my-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 hover:border-primary-300 transition-all group"
        >
          <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-primary-500" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate group-hover:text-primary-600">
              {block.caption || block.url}
            </p>
            <p className="text-sm text-gray-500 truncate">{block.url}</p>
          </div>
        </a>
      );

    default:
      return null;
  }
}

export default NotionContent;
