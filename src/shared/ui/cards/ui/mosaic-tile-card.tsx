import Image from "next/image";
import type { ReactNode } from "react";

import { Link } from "@/shared/i18n";
import { isExternalHref } from "@/shared/lib/url/is-external-href";

import type { TMosaicTileCardProps } from "../types/mosaic-tile-card.types";

function isProtocolHref(href: string): boolean {
	return isExternalHref(href) || /^(mailto:|tel:)/i.test(href);
}

function MosaicTileBody({ data }: TMosaicTileCardProps) {
	return (
		<article className="relative isolate flex h-full min-h-40 items-end overflow-hidden rounded-[10px]">
			<Image
				src={data.imageUrl}
				alt={data.title}
				fill
				className="z-[-2] object-cover transition-transform duration-500 group-hover:scale-105"
				sizes="(max-width: 768px) 100vw, 50vw"
			/>
			<div
				aria-hidden
				className="absolute inset-0 z-[-1] bg-gradient-to-t from-black/85 via-black/25 to-transparent"
			/>
			<div className="flex w-full flex-col gap-1 p-4 text-white sm:p-5">
				{data.badge ? (
					<span className="bg-primary mb-1.5 inline-block w-fit rounded-full px-2.5 py-0.5 text-[10px] tracking-[0.14em] uppercase">
						{data.badge}
					</span>
				) : null}
				<h3 className="font-serif text-xl leading-tight font-medium italic sm:text-2xl">
					{data.title}
				</h3>
				{data.description ? (
					<p className="max-w-[40ch] text-[12.5px] leading-snug text-white/85">
						{data.description}
					</p>
				) : null}
			</div>
		</article>
	);
}

export function MosaicTileCard({ data }: TMosaicTileCardProps) {
	if (!data.imageUrl) {
		return null;
	}

	const body: ReactNode = <MosaicTileBody data={data} />;

	if (!data.href) {
		return body;
	}

	if (isProtocolHref(data.href)) {
		return (
			<a
				href={data.href}
				className="group block h-full"
				{...(isExternalHref(data.href)
					? { target: "_blank", rel: "noopener noreferrer" }
					: {})}
			>
				{body}
			</a>
		);
	}

	return (
		<Link href={data.href} className="group block h-full">
			{body}
		</Link>
	);
}
