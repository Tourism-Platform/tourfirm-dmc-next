import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";
import { Card, CardContent } from "@/shared/ui/shadcn-ui";

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
		<section className={cn("overflow-hidden", className)}>
			<Card className="bg-gradient-to-r from-muted via-secondary to-accent shadow-none">
				<CardContent>
					<div
						className={cn(
							"grid grid-cols-1 items-center gap-8",
							imageSrc && "lg:grid-cols-[1fr_minmax(0,320px)]"
						)}
					>
						<div className="flex flex-col gap-4">
							<p className="text-primary text-xs font-semibold uppercase tracking-widest">
								{eyebrow}
							</p>
							<h2 className="text-2xl font-semibold sm:text-3xl">
								{title}
							</h2>
							<p className="text-muted-foreground text-sm sm:text-base">
								{description}
							</p>
							<div className="flex flex-wrap gap-3">
								{actions}
							</div>
						</div>
						{imageSrc ? (
							<div className="relative hidden min-h-56 lg:block rounded-xl mr-5 overflow-hidden">
								<Image
									src={imageSrc}
									alt={imageAlt}
									fill
									className="object-cover"
									sizes="320px"
								/>
							</div>
						) : null}
					</div>
				</CardContent>
			</Card>
		</section>
	);
}
