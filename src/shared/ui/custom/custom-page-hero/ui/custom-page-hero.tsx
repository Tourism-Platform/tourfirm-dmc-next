import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

type TCustomPageHeroProps = {
	imageSrc: string;
	imageAlt: string;
	title: ReactNode;
	topContent?: ReactNode;
	subtitle?: ReactNode;
	description?: ReactNode;
	note?: ReactNode;
	actions?: ReactNode;
	children?: ReactNode;
	className?: string;
	tags?: string[];
};

export function CustomPageHero({
	imageSrc,
	imageAlt,
	title,
	topContent,
	subtitle,
	description,
	note,
	actions,
	children,
	className,
	tags
}: TCustomPageHeroProps) {
	return (
		<section
			className={cn(
				"full-bleed relative min-h-[480px] sm:min-h-[560px]",
				className
			)}
		>
			<Image
				src={imageSrc}
				alt={imageAlt}
				fill
				priority
				className="object-cover object-[center_40%] brightness-[0.85] saturate-[1.2]"
				sizes="100vw"
			/>
			<div className="absolute inset-0 bg-black/50" />
			<div className="relative z-10 mx-auto flex min-h-[480px] w-full max-w-7xl flex-col justify-center gap-6 px-4 py-16 sm:min-h-[560px] sm:gap-8 sm:px-6 sm:py-20 lg:px-8">
				{topContent}
				<div className="font-serif flex max-w-3xl shrink-0 flex-col gap-4 text-white">
					<h1 className="text-4xl font-medium italic leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
						{title}
					</h1>
					{subtitle ? (
						<div className="text-2xl font-normal italic tracking-tight sm:text-3xl lg:text-4xl">
							{subtitle}
						</div>
					) : null}
					{description ? (
						<p className="max-w-[36ch] text-base leading-snug text-white/90 italic sm:text-xl">
							{description}
						</p>
					) : null}
					{note ? (
						<p className="text-sm text-white/75 sm:text-base">
							{note}
						</p>
					) : null}
					{tags?.length ? (
						<div className="mt-2 flex flex-wrap gap-2">
							{tags.map((tag) => (
								<span
									key={tag}
									className="rounded-full border border-white/32 px-3 py-1 text-[11.5px] text-white/90"
								>
									{tag}
								</span>
							))}
						</div>
					) : null}
					{actions ? (
						<div className="flex flex-wrap gap-3">{actions}</div>
					) : null}
				</div>
				{children ? <div className="shrink-0">{children}</div> : null}
			</div>
		</section>
	);
}
