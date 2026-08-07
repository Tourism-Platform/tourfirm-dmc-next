import { XIcon } from "lucide-react";
import type { FC } from "react";

import type { TFileWithPreview } from "@/shared/hooks";
import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui/shadcn-ui/button";

import { getFileIcon } from "../model";

import { DownloadButton } from "./download-button";

interface IFileCardProps {
	file: TFileWithPreview;
	loadingId?: string;
	isLoading?: boolean;
	readOnly?: boolean;
	onRemove: (fileId: string) => void;
}

export const FileCard: FC<IFileCardProps> = ({
	file,
	loadingId,
	isLoading,
	readOnly,
	onRemove
}) => {
	const isFileLoading =
		(!!loadingId && loadingId === file.id) ||
		(isLoading && file.file instanceof File);

	return (
		<div
			className={cn(
				"bg-background flex items-center justify-between gap-2 rounded-lg border p-2 pe-3 transition-opacity",
				isFileLoading && "opacity-60"
			)}
		>
			<div className="flex items-center gap-3 overflow-hidden">
				<div className="flex aspect-square size-10 shrink-0 items-center justify-center rounded border">
					{getFileIcon(file)}
				</div>
				<div className="flex min-w-0 flex-col gap-0.5">
					<p className="truncate text-[13px] font-medium">
						{file.file instanceof File
							? file.file.name
							: file.file.name}
					</p>
					{/* <p className="text-muted-foreground text-xs">
						{formatBytes(
							file.file instanceof File
								? file.file.size
								: file.file.size
						)}
					</p> */}
				</div>
			</div>

			<div className="flex items-center gap-1">
				{(file.preview || !(file.file instanceof File)) && (
					<DownloadButton file={file} disabled={isFileLoading} />
				)}

				{!readOnly && (
					<Button
						size="icon"
						type="button"
						variant="ghost"
						className="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent"
						onClick={() => onRemove(file.id)}
						aria-label="Remove file"
						disabled={isFileLoading}
					>
						<XIcon className="size-4" aria-hidden="true" />
					</Button>
				)}
			</div>
		</div>
	);
};
