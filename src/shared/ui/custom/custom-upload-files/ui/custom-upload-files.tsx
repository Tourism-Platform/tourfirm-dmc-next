"use client";

import {
	AlertCircleIcon,
	FileIcon,
	Trash2Icon,
	UploadIcon
} from "lucide-react";
import type { FC } from "react";

import {
	type TFileMetadata,
	type TFileWithPreview,
	useFileUpload
} from "@/shared/hooks";
import { cn } from "@/shared/lib";
import { formatUiText, useUiContent } from "@/shared/ui-content";
import { Button } from "@/shared/ui/shadcn-ui/button";

import { FileCard } from "./file-card";

export interface ICustomUploadFilesProps {
	size?: number;
	maxFiles?: number;
	initialFiles?: TFileMetadata[];
	onFilesChange?: (files: TFileWithPreview[]) => void;
	onFilesAdded?: (addedFiles: TFileWithPreview[]) => void;
	onFileRemove?: (fileId: string) => void;
	isLoading?: boolean;
	loadingId?: string;
	readOnly?: boolean;
	showAllRemoveButton?: boolean;
	showTopTitle?: boolean;
	className?: string;
}

export const CustomUploadFiles: FC<ICustomUploadFilesProps> = ({
	size = 10,
	maxFiles = 10,
	initialFiles = [],
	onFilesChange,
	onFilesAdded,
	onFileRemove,
	isLoading = false,
	loadingId,
	readOnly = false,
	showAllRemoveButton = true,
	showTopTitle = true,
	className
}) => {
	const { common } = useUiContent();
	const upload = common.uploadFiles;
	const maxSize = size * 1024 * 1024;

	const [
		{ files, isDragging, errors },
		{
			handleDragEnter,
			handleDragLeave,
			handleDragOver,
			handleDrop,
			openFileDialog,
			removeFile,
			clearFiles,
			getInputProps
		}
	] = useFileUpload({
		multiple: true,
		maxFiles,
		maxSize,
		initialFiles,
		onFilesChange,
		onFilesAdded
	});

	const handleRemoveFile = (fileId: string) => {
		removeFile(fileId);
		onFileRemove?.(fileId);
	};

	return (
		<div className="flex flex-col gap-2">
			<div
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				onDragOver={handleDragOver}
				onDrop={handleDrop}
				data-dragging={isDragging || undefined}
				data-files={files.length > 0 || undefined}
				className={cn(
					"border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex flex-col items-center rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]",
					className
				)}
			>
				{!readOnly && (
					<input
						{...getInputProps()}
						className="sr-only"
						aria-label="Upload files"
					/>
				)}

				{files.length > 0 ? (
					<div className="flex w-full flex-col gap-3">
						{(showTopTitle || showAllRemoveButton) && (
							<div className="flex items-center justify-between gap-2">
								{showTopTitle && (
									<h3 className="truncate text-sm font-medium">
										{upload.uploaded} ({files.length})
									</h3>
								)}
								{showAllRemoveButton && (
									<Button
										variant="outline"
										size="sm"
										type="button"
										onClick={clearFiles}
										disabled={isLoading}
									>
										<Trash2Icon
											className="-ms-0.5 size-3.5 opacity-60"
											aria-hidden="true"
										/>
										{upload.buttons.remove}
									</Button>
								)}
							</div>
						)}
						<div className="w-full space-y-2">
							{files.map((file) => (
								<FileCard
									key={file.id}
									file={file}
									loadingId={loadingId}
									isLoading={isLoading}
									readOnly={readOnly}
									onRemove={handleRemoveFile}
								/>
							))}

							{!readOnly && files.length < maxFiles && (
								<div className="flex justify-end">
									<Button
										variant="outline"
										type="button"
										onClick={openFileDialog}
										disabled={isLoading}
									>
										<UploadIcon
											className="-ms-1 opacity-60"
											aria-hidden="true"
										/>
										{upload.buttons.add}
									</Button>
								</div>
							)}
						</div>
					</div>
				) : (
					<div className="flex flex-col items-center justify-center text-center">
						<div
							className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
							aria-hidden="true"
						>
							<FileIcon className="size-4 opacity-60" />
						</div>
						<p className="mb-1.5 text-sm font-medium">
							{readOnly ? upload.empty : upload.title}
						</p>
						{!readOnly && (
							<>
								<p className="text-muted-foreground text-xs">
									{formatUiText(upload.description, {
										maxFiles,
										maxSize: size
									})}
								</p>
								<Button
									variant="outline"
									type="button"
									className="mt-4"
									onClick={openFileDialog}
									disabled={isLoading}
								>
									<UploadIcon
										className="-ms-1 opacity-60"
										aria-hidden="true"
									/>
									{upload.buttons.select}
								</Button>
							</>
						)}
					</div>
				)}
			</div>

			{errors.length > 0 && (
				<div
					className="text-destructive flex items-center gap-1 text-xs"
					role="alert"
				>
					<AlertCircleIcon className="size-3 shrink-0" />
					<span>{errors[0]}</span>
				</div>
			)}
		</div>
	);
};
