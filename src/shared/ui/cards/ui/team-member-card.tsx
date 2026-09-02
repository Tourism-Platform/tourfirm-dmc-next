import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

import { Link } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils";

import type { TTeamMemberCardProps } from "../types/team-member-card.types";

const PLACEHOLDER_TONES = [
	"bg-accent text-primary",
	"bg-primary/10 text-primary",
	"bg-muted text-foreground",
	"bg-secondary text-secondary-foreground"
] as const;

function getInitials(title: string): string {
	const parts = title.trim().split(/\s+/).filter(Boolean);

	if (parts.length >= 2) {
		const first = parts[0]?.[0] ?? "";
		const last = parts[parts.length - 1]?.[0] ?? "";

		return `${first}${last}`.toUpperCase();
	}

	return title.slice(0, 2).toUpperCase();
}

function placeholderTone(title: string): string {
	let hash = 0;

	for (const char of title) {
		hash += char.charCodeAt(0);
	}

	return PLACEHOLDER_TONES[hash % PLACEHOLDER_TONES.length];
}

function TeamMemberMedia({ data }: TTeamMemberCardProps) {
	const isFeatured = data.featured === true;

	if (data.imageUrl) {
		return (
			<Image
				src={data.imageUrl}
				alt={data.title}
				fill
				className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
				sizes={
					isFeatured
						? "(max-width: 768px) 100vw, 20vw"
						: "(max-width: 768px) 50vw, 15vw"
				}
			/>
		);
	}

	return (
		<div
			className={cn(
				"flex size-full items-center justify-center",
				placeholderTone(data.title)
			)}
		>
			<span
				className={cn(
					"font-serif font-medium italic",
					isFeatured ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl"
				)}
			>
				{getInitials(data.title)}
			</span>
		</div>
	);
}

function TeamMemberBody({ data }: TTeamMemberCardProps) {
	const isFeatured = data.featured === true;

	return (
		<article className="flex h-full flex-col gap-2.5">
			<div
				className={cn(
					"relative isolate w-full overflow-hidden rounded-[10px] bg-muted",
					isFeatured
						? "mx-auto h-72 max-w-xs sm:h-80"
						: "h-44 sm:h-48"
				)}
			>
				<TeamMemberMedia data={data} />
			</div>
			<div className="flex flex-col gap-1">
				<h3
					className={cn(
						"text-foreground flex items-start gap-1.5 font-serif leading-tight font-medium italic",
						isFeatured
							? "text-xl sm:text-2xl"
							: "text-base sm:text-lg"
					)}
				>
					<span>{data.title}</span>
					<ArrowUpRight
						aria-hidden
						className="text-primary mt-1 size-3.5 shrink-0 opacity-60 transition-opacity group-hover:opacity-100 sm:size-4"
					/>
				</h3>
				{data.badge ? (
					<p className="text-primary text-[10px] font-semibold tracking-[0.14em] uppercase">
						{data.badge}
					</p>
				) : null}
				{isFeatured && data.description ? (
					<p className="text-muted-foreground text-[12.5px] leading-snug">
						{data.description}
					</p>
				) : null}
				{data.langs?.length ? (
					<div className="mt-0.5 flex flex-wrap gap-1.5">
						{data.langs.map((lang) => (
							<span
								key={lang}
								className="bg-accent text-primary rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wide"
							>
								{lang}
							</span>
						))}
					</div>
				) : null}
			</div>
		</article>
	);
}

function wrapMemberCard(href: string | undefined, body: ReactNode) {
	if (!href) {
		return body;
	}

	return (
		<Link href={href} className="group block h-full">
			{body}
		</Link>
	);
}

export function TeamMemberCard({ data }: TTeamMemberCardProps) {
	return wrapMemberCard(data.href, <TeamMemberBody data={data} />);
}
