"use client";

import { DownloadIcon, Loader2Icon } from "lucide-react";
import type { FC } from "react";

import {
	type TFileMetadata,
	type TFileWithPreview,
	useDownloadFile
} from "@/shared/hooks";
import { Button } from "@/shared/ui/shadcn-ui/button";

interface IDownloadButtonProps {
	file: TFileWithPreview;
	disabled?: boolean;
}

export const DownloadButton: FC<IDownloadButtonProps> = ({
	file,
	disabled = false
}) => {
	const [{ isDownloading }, { download }] = useDownloadFile();

	const handleDownload = () => {
		const url = file.preview || (file.file as TFileMetadata).url;
		if (!url) return;

		download({ url, fileName: file.file.name });
	};

	const isDisabled = disabled || isDownloading;

	return (
		<Button
			size="icon"
			type="button"
			variant="ghost"
			className="text-muted-foreground/80 hover:text-foreground size-8 hover:bg-transparent"
			onClick={handleDownload}
			aria-label="Download file"
			disabled={isDisabled}
		>
			{isDownloading ? (
				<Loader2Icon
					className="size-4 animate-spin"
					aria-hidden="true"
				/>
			) : (
				<DownloadIcon className="size-4" aria-hidden="true" />
			)}
		</Button>
	);
};
