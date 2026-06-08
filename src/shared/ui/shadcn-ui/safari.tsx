import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/shared/lib/index";

const TRAFFIC_LIGHTS = [
	"bg-destructive",
	"bg-yellow-400",
	"bg-green-400"
] as const;

export interface SafariProps extends HTMLAttributes<HTMLDivElement> {
	url?: string;
	imageSrc?: string;
	videoSrc?: string;
	children?: ReactNode;
}

export function Safari({
	imageSrc,
	videoSrc,
	url,
	className,
	children,
	...props
}: SafariProps) {
	const hasVideo = !!videoSrc;
	const hasImage = !!imageSrc;
	const hasChildren = !!children;

	return (
		<div
			className={cn(
				"flex w-full min-h-[320px] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm",
				className
			)}
			{...props}
		>
			<div className="flex shrink-0 items-center gap-3 border-b border-border bg-muted px-3 py-2.5">
				<div className="flex shrink-0 items-center gap-1.5" aria-hidden>
					{TRAFFIC_LIGHTS.map((dotClass) => (
						<span
							key={dotClass}
							className={cn(
								"size-3 rounded-full ring-1 ring-border/60",
								dotClass
							)}
						/>
					))}
				</div>
				{url ? (
					<p className="min-w-0 flex-1 truncate rounded-md border border-border bg-background px-3 py-1 text-center text-xs text-muted-foreground">
						{url}
					</p>
				) : null}
			</div>

			<div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-background text-foreground">
				{hasVideo ? (
					<video
						className="block size-full min-h-[240px] object-cover"
						src={videoSrc}
						autoPlay
						loop
						muted
						playsInline
						preload="metadata"
					/>
				) : null}

				{!hasVideo && hasImage ? (
					<img
						src={imageSrc}
						alt=""
						className="block size-full min-h-[240px] object-cover object-top"
					/>
				) : null}

				{hasChildren ? (
					<div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
						<div className="min-h-full">{children}</div>
					</div>
				) : null}

				{!hasVideo && !hasImage && !hasChildren ? (
					<div className="min-h-[240px] flex-1 bg-muted/30" />
				) : null}
			</div>
		</div>
	);
}
