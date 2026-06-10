import Image from "next/image";

import { ENUM_PATH } from "@/shared/config";
import { ButtonLink } from "@/shared/ui";

type TServicesDirectionCardProps = {
	imageSrc: string;
	imageAlt: string;
	title: string;
	description: string;
	cta: string;
};

export function ServicesDirectionCard({
	imageSrc,
	imageAlt,
	title,
	description,
	cta
}: TServicesDirectionCardProps) {
	return (
		<article className="bg-card flex flex-col overflow-hidden rounded-xl border">
			<div className="relative min-h-48 sm:min-h-56">
				<Image
					src={imageSrc}
					alt={imageAlt}
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
				<ButtonLink
					href={ENUM_PATH.HELP.CONTACT}
					variant="outline"
					className="w-fit"
				>
					{cta}
				</ButtonLink>
			</div>
		</article>
	);
}
