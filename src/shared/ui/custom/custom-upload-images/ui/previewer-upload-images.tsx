"use client";

import { XIcon, ZoomInIcon } from "lucide-react";
import { type FC, type ReactNode, useState } from "react";

import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui";

import {
	UPLOAD_IMAGES_GRID_HEIGHT,
	getUploadImagesLayout
} from "../model/upload-images-layout";

// ─── Image Card ───────────────────────────────────────────────────────────────

interface IPreviewImageCardProps {
	src: string;
	alt?: string;
	isPrimary?: boolean;
	gridArea?: string;
	onPreview?: (src: string) => void;
	overlay?: ReactNode;
}

export const PreviewImageCard: FC<IPreviewImageCardProps> = ({
	src,
	alt = "",
	isPrimary = false,
	gridArea,
	onPreview,
	overlay
}) => (
	<div
		className={cn(
			"group relative rounded-lg overflow-hidden",
			!gridArea && "h-[200px]"
		)}
		style={gridArea ? { gridArea } : undefined}
	>
		<img
			src={src}
			alt={alt}
			className={cn(
				"h-full w-full rounded-lg border object-cover transition-transform group-hover:scale-105",
				isPrimary && "ring-2 ring-yellow-400"
			)}
			draggable={false}
		/>

		{(onPreview || overlay) && (
			<div className="absolute inset-0 flex items-center justify-center gap-1.5 rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
				{onPreview && (
					<Button
						type="button"
						onClick={() => onPreview(src)}
						variant="secondary"
						size="icon"
						className="size-7"
					>
						<ZoomInIcon className="h-3.5 w-3.5" />
					</Button>
				)}
				{overlay}
			</div>
		)}
	</div>
);

// ─── Lightbox ─────────────────────────────────────────────────────────────────

interface IUploadImagesLightboxProps {
	src: string | null;
	onClose: () => void;
}

export const UploadImagesLightbox: FC<IUploadImagesLightboxProps> = ({
	src,
	onClose
}) => {
	if (!src) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
			onClick={onClose}
		>
			<div className="relative max-h-full max-w-full">
				<img
					src={src}
					alt="Preview"
					className="max-h-full max-w-full rounded-lg object-contain"
					onClick={(e) => e.stopPropagation()}
				/>
				<Button
					type="button"
					onClick={onClose}
					variant="secondary"
					size="icon"
					className="absolute end-2 top-2 size-7"
				>
					<XIcon className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
};

// ─── Grid ─────────────────────────────────────────────────────────────────────

interface IUploadImagesGridProps {
	images: string[];
	className?: string;
	gridHeight?: number;
	showPrimaryBadge?: boolean;
	enableZoom?: boolean;
}

export const UploadImagesGrid: FC<IUploadImagesGridProps> = ({
	images,
	className,
	gridHeight = UPLOAD_IMAGES_GRID_HEIGHT,
	showPrimaryBadge = true,
	enableZoom = true
}) => {
	const [previewSrc, setPreviewSrc] = useState<string | null>(null);

	if (!images.length) return null;

	const layout = getUploadImagesLayout(images.length);
	const featured = images.slice(0, 5);
	const rest = images.slice(5);

	return (
		<>
			<div className={cn("flex flex-col gap-4 w-full", className)}>
				<div
					className="grid gap-2 w-full"
					style={{ height: gridHeight, ...layout?.style }}
				>
					{featured.map((src, idx) => (
						<PreviewImageCard
							key={`${src}-${idx}`}
							src={src}
							alt={`Image ${idx + 1}`}
							isPrimary={showPrimaryBadge && idx === 0}
							gridArea={layout?.areas[idx]}
							onPreview={enableZoom ? setPreviewSrc : undefined}
						/>
					))}
				</div>

				{rest.length > 0 && (
					<div className="grid gap-4 w-full grid-cols-3">
						{rest.map((src, idx) => (
							<PreviewImageCard
								key={`${src}-${idx + 5}`}
								src={src}
								alt={`Image ${idx + 6}`}
								onPreview={
									enableZoom ? setPreviewSrc : undefined
								}
							/>
						))}
					</div>
				)}
			</div>

			{enableZoom && (
				<UploadImagesLightbox
					src={previewSrc}
					onClose={() => setPreviewSrc(null)}
				/>
			)}
		</>
	);
};

// ─── Previewer ────────────────────────────────────────────────────────────────

interface IUploadImagesPreviewerProps {
	images?: string[];
	className?: string;
	gridHeight?: number;
	showPrimaryBadge?: boolean;
	enableZoom?: boolean;
}

export const UploadImagesPreviewer: FC<IUploadImagesPreviewerProps> = ({
	images = [],
	className,
	...gridProps
}) => (
	<div className={cn("w-full", className)}>
		<UploadImagesGrid images={images} {...gridProps} />
	</div>
);
