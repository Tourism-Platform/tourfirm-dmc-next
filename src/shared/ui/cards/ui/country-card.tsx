import Image from "next/image";

import { Link } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils";

import { Badge } from "../../shadcn-ui/badge";
import { Card } from "../../shadcn-ui/card";
import type { TCountryCardProps } from "../types/country-card.types";

export function CountryCard({ data }: TCountryCardProps) {
	return (
		<Link
			href={data.href}
			className={cn("group block", data.featured && "sm:col-span-2")}
		>
			<Card
				className={cn(
					"relative overflow-hidden p-0 transition-shadow group-hover:shadow-lg",
					data.featured ? "h-72 sm:h-80 lg:h-96" : "h-56 sm:h-64"
				)}
			>
				<Image
					src={data.imageUrl}
					alt={data.title}
					fill
					className="object-cover transition-transform duration-300 group-hover:scale-105"
					sizes={
						data.featured
							? "(max-width: 1024px) 100vw, 66vw"
							: "(max-width: 640px) 100vw, 50vw"
					}
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
				<div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-4 sm:p-5 lg:p-6">
					<Badge
						variant="secondary"
						className="w-fit bg-card/90 text-foreground"
					>
						{data.badge}
					</Badge>
					<div className="flex flex-col gap-1.5">
						<p className="text-xl font-semibold text-white sm:text-2xl">
							{data.title}
						</p>
						<p className="text-base text-white">
							{data.description}
						</p>
					</div>
					<div className="flex flex-wrap gap-2">
						{data.cities.map((city) => (
							<Badge key={city} className="text-base">
								{city}
							</Badge>
						))}
					</div>
				</div>
			</Card>
		</Link>
	);
}
