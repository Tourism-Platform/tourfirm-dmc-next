import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

type TCustomCtaBannerProps = {
	eyebrow?: string;
	title?: ReactNode;
	description?: string;
	actions?: ReactNode;
	imageSrc?: string;
	imageAlt?: string;
	className?: string;
};

export function CustomCtaBanner({
	eyebrow,
	title,
	description,
	actions,
	imageSrc,
	imageAlt = "",
	className
}: TCustomCtaBannerProps) {
	return (
		<section className={cn("w-full", className)}>
			<div
				className={cn(
					"relative overflow-hidden rounded-2xl",
					"border border-border/60 bg-secondary/70",
					"shadow-[0_1px_0_rgba(43,74,138,0.04)]"
				)}
			>
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_55%),linear-gradient(135deg,color-mix(in_oklab,var(--secondary)_90%,white),color-mix(in_oklab,var(--accent)_80%,transparent))]"
				/>
				<div
					aria-hidden
					className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-primary/10 blur-3xl"
				/>

				<div
					className={cn(
						"relative grid items-stretch gap-0",
						imageSrc &&
							"lg:grid-cols-[minmax(0,1fr)_minmax(280px,38%)]"
					)}
				>
					<div className="flex flex-col justify-center gap-5 px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
						{eyebrow ? (
							<p className="text-primary text-[11px] font-semibold uppercase tracking-[0.22em]">
								{eyebrow}
							</p>
						) : null}

						{title ? (
							<h2 className="max-w-xl font-[family-name:var(--font-kurier)] text-3xl font-normal italic leading-tight tracking-tight text-secondary-foreground sm:text-4xl">
								{title}
							</h2>
						) : null}

						{description ? (
							<p className="max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
								{description}
							</p>
						) : null}

						{actions ? (
							<div className="mt-1 flex flex-wrap items-center gap-3">
								{actions}
							</div>
						) : null}
					</div>

					{imageSrc ? (
						<div className="relative min-h-52 overflow-hidden sm:min-h-64 lg:min-h-[300px]">
							<div className="absolute inset-0 lg:inset-3 lg:overflow-hidden lg:rounded-xl">
								<Image
									src={imageSrc}
									alt={imageAlt}
									fill
									className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
									sizes="(max-width: 1024px) 100vw, 38vw"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-secondary-foreground/20 via-transparent to-transparent lg:bg-gradient-to-l lg:from-transparent lg:to-secondary/15" />
							</div>
						</div>
					) : null}
				</div>
			</div>
		</section>
	);
}
