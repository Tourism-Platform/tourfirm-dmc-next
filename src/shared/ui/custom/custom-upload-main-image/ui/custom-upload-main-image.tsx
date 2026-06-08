"use client";

import { AlertCircleIcon, ImageUpIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { FC } from "react";

import { useFileUpload } from "@/shared/hooks";
import { type TFileWithPreview } from "@/shared/hooks";
import { cn } from "@/shared/lib";
import { formatBytes } from "@/shared/utils";

interface ICustomUploadMainImageProps {
	maxSize?: number;
	accept?: string;
	className?: string;
	onFilesChange?: (files: TFileWithPreview[]) => void;
	initialValue?: string;
}

export const CustomUploadMainImage: FC<ICustomUploadMainImageProps> = ({
	maxSize = 5 * 1024 * 1024, // 5MB default
	accept = "image/*",
	className,
	onFilesChange,
	initialValue
}) => {
	const t = useTranslations("common");

	const [
		{ files, isDragging, errors },
		{
			handleDragEnter,
			handleDragLeave,
			handleDragOver,
			handleDrop,
			openFileDialog,
			removeFile,
			getInputProps
		}
	] = useFileUpload({
		accept,
		maxSize,
		maxFiles: 1,
		initialFiles: initialValue
			? [
					{
						id: "initial",
						url: initialValue,
						name: "initial-image",
						size: 0,
						type: "image/*"
					}
				]
			: [],
		onFilesChange
	});

	const previewUrl = files[0]?.preview || null;

	const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		removeFile(files[0]?.id);
	};

	return (
		<div className={cn("flex flex-col gap-2", className)}>
			<div className="relative">
				{/* Drop area */}
				<div
					className={cn(
						"relative flex min-h-72 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors hover:bg-accent/50",
						"has-disabled:pointer-events-none has-[input:focus]:border-ring has-disabled:opacity-50 has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50",
						isDragging
							? "bg-accent/50 border-primary"
							: "border-input",
						previewUrl ? "border-none" : ""
					)}
					onClick={openFileDialog}
					onDragEnter={handleDragEnter}
					onDragLeave={handleDragLeave}
					onDragOver={handleDragOver}
					onDrop={handleDrop}
					role="button"
					tabIndex={-1}
				>
					<input
						{...getInputProps()}
						aria-label={t("upload_main_image.title")}
						className="sr-only"
					/>
					{previewUrl ? (
						<div className="absolute inset-0">
							<img
								alt={files[0]?.file?.name || "Uploaded image"}
								className="size-full object-contain aspect-video"
								src={previewUrl}
							/>
						</div>
					) : (
						<div className="flex flex-col items-center justify-center px-4 py-3 text-center">
							<div
								aria-hidden="true"
								className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background"
							>
								<ImageUpIcon className="size-4 opacity-60" />
							</div>
							<p className="mb-1.5 font-medium text-sm">
								{t("upload_main_image.description")}
							</p>
							<p className="text-muted-foreground text-xs">
								{t("upload_main_image.formats", {
									maxSize: formatBytes(maxSize)
								})}
							</p>
						</div>
					)}
				</div>
				{previewUrl && (
					<div className="absolute top-4 right-4">
						<button
							aria-label={t("upload_main_image.errors.remove")}
							className="z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white outline-none transition-[color,box-shadow] hover:bg-black/80 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
							onClick={handleDeleteClick}
							type="button"
						>
							<XIcon aria-hidden="true" className="size-4" />
						</button>
					</div>
				)}
			</div>

			{errors.length > 0 && (
				<div
					className="flex items-center gap-1 text-destructive text-xs"
					role="alert"
				>
					<AlertCircleIcon className="size-3 shrink-0" />
					<span>{errors[0]}</span>
				</div>
			)}
		</div>
	);
};
