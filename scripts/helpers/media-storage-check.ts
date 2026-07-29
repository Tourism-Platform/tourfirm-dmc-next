import {
	HeadObjectCommand,
	S3Client,
	type S3ClientConfig
} from "@aws-sdk/client-s3";
import { getFileKey } from "@payloadcms/plugin-cloud-storage/utilities";

import type { Media } from "@/payload-types";

export type TMediaStorageCheckResult =
	| { exists: true; key: string }
	| { exists: false; key: string; reason: "not_found" };

type TMediaForStorageKey = Pick<Media, "filename" | "url" | "sourcePath"> & {
	prefix?: string | null;
};

let cachedClient: S3Client | null = null;

function requireS3Env(): {
	bucket: string;
	config: S3ClientConfig;
} {
	const bucket = process.env.S3_BUCKET;

	if (!bucket) {
		throw new Error(
			"S3_BUCKET is not set — cannot verify media objects in storage"
		);
	}

	return {
		bucket,
		config: {
			credentials: {
				accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
				secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || ""
			},
			endpoint: process.env.S3_ENDPOINT,
			region: process.env.S3_REGION || "auto",
			forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true"
		}
	};
}

function getS3Client(): S3Client {
	if (cachedClient) {
		return cachedClient;
	}

	const { config } = requireS3Env();
	cachedClient = new S3Client(config);
	return cachedClient;
}

/**
 * Resolve storage filename for a Media doc.
 * Prefer `filename`; fall back to URL basename / sourcePath basename.
 */
export function resolveMediaStorageFilename(
	media: TMediaForStorageKey,
	sourcePath: string
): string {
	if (typeof media.filename === "string" && media.filename.trim().length > 0) {
		return media.filename;
	}

	if (typeof media.url === "string" && media.url.trim().length > 0) {
		const pathPart = media.url.split("?")[0] ?? media.url;
		const base = pathPart.split("/").pop();

		if (base && base.length > 0) {
			try {
				return decodeURIComponent(base);
			} catch {
				return base;
			}
		}
	}

	return sourcePath.split("/").pop() ?? sourcePath;
}

/**
 * Build the S3/R2 object key using the same helper as `@payloadcms/storage-s3`
 * (`getFileKey` from `@payloadcms/plugin-cloud-storage/utilities`).
 *
 * Matches project payload.config: media collection has no prefix,
 * `useCompositePrefixes` defaults to false.
 */
export function resolveMediaStorageKey(
	media: TMediaForStorageKey,
	sourcePath: string
): string {
	const filename = resolveMediaStorageFilename(media, sourcePath);
	const docPrefix =
		typeof media.prefix === "string" ? media.prefix : undefined;

	const { fileKey } = getFileKey({
		collectionPrefix: "",
		docPrefix,
		filename,
		useCompositePrefixes: false
	});

	return fileKey;
}

function isS3NotFoundError(error: unknown): boolean {
	if (!error || typeof error !== "object") {
		return false;
	}

	const err = error as {
		name?: string;
		Code?: string;
		$metadata?: { httpStatusCode?: number };
	};

	if (err.name === "NotFound" || err.name === "NoSuchKey") {
		return true;
	}

	if (err.Code === "NotFound" || err.Code === "NoSuchKey") {
		return true;
	}

	return err.$metadata?.httpStatusCode === 404;
}

/**
 * HeadObject against the same bucket/config Payload's S3 adapter uses.
 * - exists → valid
 * - NotFound → missing (broken)
 * - other errors → throw (do not treat as broken)
 */
export async function checkMediaObjectExistsInStorage(
	media: TMediaForStorageKey,
	sourcePath: string
): Promise<TMediaStorageCheckResult> {
	const { bucket } = requireS3Env();
	const key = resolveMediaStorageKey(media, sourcePath);
	const client = getS3Client();

	try {
		await client.send(
			new HeadObjectCommand({
				Bucket: bucket,
				Key: key
			})
		);

		return { exists: true, key };
	} catch (error) {
		if (isS3NotFoundError(error)) {
			return { exists: false, key, reason: "not_found" };
		}

		throw error;
	}
}
