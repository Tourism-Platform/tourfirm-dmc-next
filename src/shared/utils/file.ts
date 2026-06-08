/**
 * Функция для программного скачивания файла по URL
 * @param url - прямая ссылка на файл или blob
 * @param fileName - имя, под которым файл будет сохранен
 */
export const downloadFile = (url: string, fileName: string): void => {
	if (!url) return;

	const link = document.createElement("a");
	link.href = url;
	link.download = fileName;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};

/**
 * Форматирует размер файла из байтов в читаемый вид (KB, MB, GB...)
 */
export const formatBytes = (bytes: number, decimals = 2): string => {
	if (bytes === 0) return "0 Bytes";

	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};
