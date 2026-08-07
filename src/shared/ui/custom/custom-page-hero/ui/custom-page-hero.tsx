import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

type TCustomPageHeroSize = "tall" | "compact";

type TCustomPageHeroProps = {
	imageSrc: string;
	imageAlt: string;
	title: ReactNode;
	eyebrow?: ReactNode;
	topContent?: ReactNode;
	subtitle?: ReactNode;
	description?: ReactNode;
	note?: ReactNode;
	actions?: ReactNode;
	children?: ReactNode;
	size?: TCustomPageHeroSize;
	className?: string;
};

const SIZE_CLASSES: Record<
	TCustomPageHeroSize,
	{ section: string; container: string; minHeight: string }
> = {
	tall: {
		section: "min-h-[480px] sm:min-h-[560px]",
		container:
			"min-h-[480px] gap-6 py-16 sm:min-h-[560px] sm:gap-8 sm:py-20",
		minHeight: "min-h-[480px] sm:min-h-[560px]"
	},
	compact: {
		section: "min-h-[400px] sm:min-h-[480px]",
		container:
			"min-h-[400px] gap-4 py-16 sm:min-h-[480px] sm:gap-6 sm:py-20",
		minHeight: "min-h-[400px] sm:min-h-[480px]"
	}
};

export function CustomPageHero({
	imageSrc,
	imageAlt,
	title,
	// eyebrow,
	topContent,
	subtitle,
	description,
	note,
	actions,
	children,
	size = "compact",
	className
}: TCustomPageHeroProps) {
	const sizeClasses = SIZE_CLASSES[size];
	const hasSearchSlot = Boolean(children);

	return (
		<section
			className={cn(
				"full-bleed relative",
				sizeClasses.section,
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
			<div
				className={cn(
					"relative z-10 mx-auto flex w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8",
					hasSearchSlot
						? cn(
								sizeClasses.minHeight,
								"justify-between gap-6 pt-16 pb-0 sm:gap-8 sm:pt-20"
							)
						: cn("justify-center", sizeClasses.container)
				)}
			>
				{topContent}
				<div className="flex max-w-3xl flex-col gap-4 text-white">
					{/* {eyebrow} */}
					<h1 className="font-sans text-3xl font-semibold uppercase leading-tight tracking-tight sm:text-4xl lg:text-5xl">
						{title}
					</h1>
					{subtitle ? (
						<div className="font-serif text-2xl font-normal italic tracking-tight sm:text-3xl lg:text-4xl">
							{subtitle}
						</div>
					) : null}
					{description ? (
						<p className="font-sans text-sm text-white/90 sm:text-base">
							{description}
						</p>
					) : null}
					{note ? (
						<p className="text-sm text-white/75 sm:text-base">
							{note}
						</p>
					) : null}
					{actions ? (
						<div className="flex flex-wrap gap-3">{actions}</div>
					) : null}
				</div>
				{children}
			</div>
		</section>
	);
}
