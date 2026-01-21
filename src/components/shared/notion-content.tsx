import { cn } from "@/lib/utils";
import type { NotionBlock } from "@/lib/notion/queries";
import { FileText, ExternalLink, CheckSquare, Square, Download } from "lucide-react";

interface NotionContentProps {
  blocks: NotionBlock[];
  className?: string;
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
                  {listItem.content}
                </li>
              ))}
            </ListTag>
          );
        }

        return <NotionBlockRenderer key={item.id} block={item} />;
      })}
    </div>
  );
}

function NotionBlockRenderer({ block }: { block: NotionBlock }) {
  switch (block.type) {
    case "paragraph":
      if (!block.content) return <div className="h-4" />;
      return <p className="text-gray-700 leading-relaxed my-3">{block.content}</p>;

    case "heading_1":
      return (
        <h1 className="text-2xl font-bold text-gray-900 mt-8 mb-4 first:mt-0">
          {block.content}
        </h1>
      );

    case "heading_2":
      return (
        <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3 first:mt-0">
          {block.content}
        </h2>
      );

    case "heading_3":
      return (
        <h3 className="text-lg font-medium text-gray-900 mt-5 mb-2 first:mt-0">
          {block.content}
        </h3>
      );

    case "to_do":
      return (
        <div className="flex items-start gap-2 my-2">
          <Square className="w-4 h-4 mt-1 text-gray-400 flex-shrink-0" />
          <span className="text-gray-700">{block.content}</span>
        </div>
      );

    case "to_do_checked":
      return (
        <div className="flex items-start gap-2 my-2">
          <CheckSquare className="w-4 h-4 mt-1 text-green-500 flex-shrink-0" />
          <span className="text-gray-500 line-through">{block.content}</span>
        </div>
      );

    case "toggle":
      return (
        <details className="my-3 group">
          <summary className="cursor-pointer text-gray-700 font-medium hover:text-gray-900">
            {block.content}
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
          {block.content}
        </blockquote>
      );

    case "callout":
      return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
          <p className="text-blue-800">{block.content}</p>
        </div>
      );

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
