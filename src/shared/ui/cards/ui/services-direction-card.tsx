import Image from "next/image";

import { ENUM_PATH } from "@/shared/config";
import { Link } from "@/shared/i18n";

import { Button } from "../../shadcn-ui/button";
import type { TServicesDirectionCardProps } from "../types/services-direction-card.types";

export function ServicesDirectionCard({
	imageUrl,
	title,
	description,
	ctaLabel
}: TServicesDirectionCardProps) {
	return (
		<article className="bg-card flex flex-col overflow-hidden rounded-xl border">
			<div className="relative min-h-48 sm:min-h-56">
				<Image
					src={imageUrl}
					alt={title}
					fill
					className="object-cover"
					sizes="(max-width: 768px) 100vw, 33vw"
				/>
			</div>
			<div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
				<h3 className="text-base font-semibold sm:text-lg">{title}</h3>
				<p className="text-muted-foreground flex-1 text-sm sm:text-base">
					{description}
				</p>
				<Button asChild variant="outline" className="w-fit">
					<Link href={ENUM_PATH.HELP.CONTACT}>{ctaLabel}</Link>
				</Button>
			</div>
		</article>
	);
}
