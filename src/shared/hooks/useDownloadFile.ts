"use client";

import { useCallback, useState } from "react";

export type TDownloadProgress = {
	loaded: number;
	total: number;
	percent: number;
};

export type TDownloadState = {
	isDownloading: boolean;
	progress: TDownloadProgress | null;
	error: string | null;
};

export type TDownloadActions = {
	download: (params: IDownloadFile) => Promise<void>;
	reset: () => void;
};

export interface IDownloadFile {
	url: string;
	fileName: string;
}

export type TUseDownloadFileReturn = [TDownloadState, TDownloadActions];

/**
 * Хук для скачивания файлов с отслеживанием прогресса
 */
export const useDownloadFile = (): TUseDownloadFileReturn => {
	const [state, setState] = useState<TDownloadState>({
		isDownloading: false,
		progress: null,
		error: null
	});

	const reset = useCallback(() => {
		setState({
			isDownloading: false,
			progress: null,
			error: null
		});
	}, []);

	const download = useCallback(async ({ url, fileName }: IDownloadFile) => {
		if (!url) return;

		setState({
			isDownloading: true,
			progress: { loaded: 0, total: 0, percent: 0 },
			error: null
		});

		try {
			const xhr = new XMLHttpRequest();

			const downloadPromise = new Promise<Blob>((resolve, reject) => {
				xhr.open("GET", url, true);
				xhr.responseType = "blob";

				xhr.onprogress = (event) => {
					if (event.lengthComputable) {
						const percent = Math.round(
							(event.loaded / event.total) * 100
						);
						setState((prev) => ({
							...prev,
							progress: {
								loaded: event.loaded,
								total: event.total,
								percent
							}
						}));
					}
				};

				xhr.onload = () => {
					if (xhr.status >= 200 && xhr.status < 300) {
						resolve(xhr.response as Blob);
					} else {
						reject(new Error(`HTTP Error: ${xhr.status}`));
					}
				};

				xhr.onerror = () => {
					reject(new Error("Network error"));
				};

				xhr.send();
			});

			const blob = await downloadPromise;

			// Создаём ссылку для скачивания
			const blobUrl = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = blobUrl;
			link.download = fileName;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(blobUrl);

			setState({
				isDownloading: false,
				progress: { loaded: 0, total: 0, percent: 100 },
				error: null
			});
		} catch (error) {
			setState({
				isDownloading: false,
				progress: null,
				error:
					error instanceof Error ? error.message : "Download failed"
			});
		}
	}, []);

	return [state, { download, reset }];
};
