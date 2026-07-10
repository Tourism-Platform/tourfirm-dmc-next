import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/shared/i18n/request.ts");

function s3PublicRemotePattern():
	| {
			protocol: "http" | "https";
			hostname: string;
			pathname?: string;
	  }
	| undefined {
	const raw = process.env.S3_PUBLIC_URL?.trim();

	if (!raw) {
		return undefined;
	}

	try {
		const url = new URL(raw);
		const protocol = url.protocol === "http:" ? "http" : "https";
		const pathname =
			url.pathname && url.pathname !== "/"
				? `${url.pathname.replace(/\/$/, "")}/**`
				: undefined;

		return {
			protocol,
			hostname: url.hostname,
			...(pathname ? { pathname } : {})
		};
	} catch {
		return undefined;
	}
}

const s3Pattern = s3PublicRemotePattern();

const nextConfig: NextConfig = {
	output: "standalone",
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "www.atorus.ru"
			},
			...(s3Pattern ? [s3Pattern] : [])
		]
	}
};

export default withPayload(withNextIntl(nextConfig));
