const RETRY_DELAYS_MS = [2_000, 5_000, 10_000, 30_000] as const;
const MAX_ATTEMPTS = RETRY_DELAYS_MS.length + 1;

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

function getErrorText(error: unknown): string {
	const parts: string[] = [];

	let current: unknown = error;
	let depth = 0;

	while (current && depth < 4) {
		if (current instanceof Error) {
			parts.push(current.message);

			if (current.cause) {
				current = current.cause;
				depth += 1;
				continue;
			}
		} else {
			parts.push(String(current));
		}

		break;
	}

	return parts.join(" ").toLowerCase();
}

export function isRetryableNeonError(error: unknown): boolean {
	const text = getErrorText(error);

	return (
		text.includes("ssl eof") ||
		text.includes("econnreset") ||
		text.includes("connection terminated") ||
		text.includes("server closed the connection") ||
		text.includes("connection terminated unexpectedly") ||
		text.includes("deadlock detected") ||
		text.includes("40p01")
	);
}

export async function withTimeout<T>(
	operation: Promise<T>,
	ms: number,
	label: string
): Promise<T> {
	let timer: NodeJS.Timeout | undefined;

	try {
		return await Promise.race([
			operation,
			new Promise<T>((_, reject) => {
				timer = setTimeout(() => {
					reject(new Error(`${label} timed out after ${ms / 1000}s`));
				}, ms);
			})
		]);
	} finally {
		if (timer) {
			clearTimeout(timer);
		}
	}
}

export async function withRetry<T>(
	operation: () => Promise<T>,
	label: string
): Promise<T> {
	let lastError: unknown;

	for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
		try {
			return await operation();
		} catch (error) {
			lastError = error;

			if (!isRetryableNeonError(error) || attempt === MAX_ATTEMPTS) {
				throw error;
			}

			const delayMs = RETRY_DELAYS_MS[attempt - 1] ?? 30_000;

			console.warn(
				`  ! retry ${attempt}/${MAX_ATTEMPTS - 1} for ${label} in ${delayMs / 1000}s (${getErrorText(error).slice(0, 120)})`
			);

			await sleep(delayMs);
		}
	}

	throw lastError;
}
