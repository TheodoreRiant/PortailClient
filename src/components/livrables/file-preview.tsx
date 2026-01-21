"use client";

import { useState } from "react";
import Image from "next/image";
import {
  FileText,
  Download,
  ExternalLink,
  Maximize2,
  X,
  File,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { NotionFile } from "@/types";

interface FilePreviewProps {
  file: NotionFile;
  className?: string;
}

function getFileType(file: NotionFile): "image" | "pdf" | "video" | "audio" | "archive" | "other" {
  const name = file.name.toLowerCase();
  const url = file.url.toLowerCase();

  if (/\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?|$)/.test(url) || /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/.test(name)) {
    return "image";
  }
  if (/\.pdf(\?|$)/.test(url) || name.endsWith(".pdf")) {
    return "pdf";
  }
  if (/\.(mp4|webm|mov|avi)(\?|$)/.test(url) || /\.(mp4|webm|mov|avi)$/.test(name)) {
    return "video";
  }
  if (/\.(mp3|wav|ogg|m4a)(\?|$)/.test(url) || /\.(mp3|wav|ogg|m4a)$/.test(name)) {
    return "audio";
  }
  if (/\.(zip|rar|7z|tar|gz|tgz)(\?|$)/.test(url) || /\.(zip|rar|7z|tar|gz|tgz)$/.test(name)) {
    return "archive";
  }
  return "other";
}

function getFileIcon(fileType: string) {
  switch (fileType) {
    case "image":
      return FileImage;
    case "pdf":
      return FileText;
    case "video":
      return FileVideo;
    case "audio":
      return FileAudio;
    case "archive":
      return FileArchive;
    default:
      return File;
  }
}

export function FilePreview({ file, className }: FilePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fileType = getFileType(file);
  const FileIcon = getFileIcon(fileType);

  const renderPreview = (isFullSize = false) => {
    if (fileType === "image" && !imageError) {
      return (
        <div className={cn("relative", isFullSize ? "max-h-[80vh]" : "h-48")}>
          <img
            src={file.url}
            alt={file.name}
            className={cn(
              "object-contain rounded-lg",
              isFullSize ? "max-w-full max-h-[80vh]" : "w-full h-full"
            )}
            onError={() => setImageError(true)}
          />
        </div>
      );
    }

    if (fileType === "pdf") {
      if (isFullSize) {
        return (
          <iframe
            src={file.url}
            className="w-full h-[80vh] rounded-lg border"
            title={file.name}
          />
        );
      }
      return (
        <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-center">
            <FileText className="w-12 h-12 mx-auto text-red-500 mb-2" />
            <p className="text-sm text-gray-600">{file.name}</p>
          </div>
        </div>
      );
    }

    if (fileType === "video") {
      return (
        <video
          controls
          className={cn("rounded-lg", isFullSize ? "max-w-full max-h-[80vh]" : "w-full h-48")}
        >
          <source src={file.url} />
          Votre navigateur ne supporte pas la lecture vidéo.
        </video>
      );
    }

    if (fileType === "audio") {
      return (
        <div className={cn("flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200", isFullSize ? "p-8" : "h-48")}>
          <div className="text-center w-full">
            <FileAudio className="w-12 h-12 mx-auto text-purple-500 mb-4" />
            <audio controls className="w-full max-w-md mx-auto">
              <source src={file.url} />
            </audio>
          </div>
        </div>
      );
    }

    // Archive files
    if (fileType === "archive") {
      return (
        <div className={cn("flex items-center justify-center bg-amber-50 rounded-lg border border-amber-200", isFullSize ? "p-12" : "h-48")}>
          <div className="text-center">
            <FileArchive className="w-12 h-12 mx-auto text-amber-600 mb-2" />
            <p className="text-sm font-medium text-gray-900 mb-1">{file.name}</p>
            <p className="text-xs text-gray-500">Archive compressée</p>
          </div>
        </div>
      );
    }

    // Other file types
    return (
      <div className={cn("flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200", isFullSize ? "p-12" : "h-48")}>
        <div className="text-center">
          <FileIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
          <p className="text-sm font-medium text-gray-900 mb-1">{file.name}</p>
          <p className="text-xs text-gray-500">Aperçu non disponible</p>
        </div>
      </div>
    );
  };

  return (
    <div className={cn("group", className)}>
      {/* Thumbnail */}
      <div className="relative">
        {renderPreview()}

        {/* Overlay actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" size="sm" className="gap-1.5">
                  <Maximize2 className="w-4 h-4" />
                  Agrandir
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <FileIcon className="w-5 h-5" />
                    {file.name}
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-4">{renderPreview(true)}</div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" asChild>
                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Ouvrir
                    </a>
                  </Button>
                  <Button asChild>
                    <a href={file.url} download={file.name}>
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </a>
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="secondary" size="sm" className="gap-1.5" asChild>
              <a href={file.url} download={file.name}>
                <Download className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* File name */}
      <p className="mt-2 text-sm text-gray-600 truncate">{file.name}</p>
    </div>
  );
}

export function FileList({
  files,
  className,
}: {
  files: NotionFile[];
  className?: string;
}) {
  if (!files || files.length === 0) {
    return null;
  }

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
      {files.map((file, index) => (
        <FilePreview key={index} file={file} />
      ))}
    </div>
  );
}

export default FilePreview;
