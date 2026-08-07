import Image from "next/image";

import { Link } from "@/shared/i18n";
import { cn } from "@/shared/lib/utils";

import { Badge } from "../../shadcn-ui/badge";
import { Card } from "../../shadcn-ui/card";
import type { TTourDestinationCardProps } from "../types/tour-destination-card.types";

export function TourDestinationCard({ data }: TTourDestinationCardProps) {
	return (
		<Link
			href={data.href}
			className={cn("group block", data.featured && "sm:col-span-2")}
		>
			<Card
				className={cn(
					"relative overflow-hidden rounded-2xl border-0 p-0 shadow-sm ring-1 ring-black/5 transition-[transform,box-shadow] duration-300 group-hover:-translate-y-0.5 group-hover:shadow-xl",
					data.className,
					data.featured
						? "h-72 sm:h-80 lg:h-96"
						: "aspect-[4/5] min-h-56 sm:aspect-[5/6] sm:h-auto"
				)}
			>
				<Image
					src={data.imageUrl || "/assets/images/city/samarkand.jpg"}
					alt={data.title}
					fill
					className="object-cover transition-transform duration-500 group-hover:scale-105"
					sizes={
						data.featured
							? "(max-width: 1024px) 100vw, 66vw"
							: "(max-width: 640px) 100vw, 33vw"
					}
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5" />
				<div className="absolute inset-x-0 bottom-0 flex flex-col gap-2.5 p-4 sm:p-5">
					{data.badge ? (
						<Badge
							variant="secondary"
							className="w-fit border-0 bg-white/90 text-foreground shadow-sm backdrop-blur-sm"
						>
							{data.badge}
						</Badge>
					) : null}
					<div className="flex flex-col gap-1">
						<p className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
							{data.title}
						</p>
						{data.description ? (
							<p className="text-sm text-white/85 sm:text-base">
								{data.description}
							</p>
						) : null}
					</div>
					{!!data.cities?.length && (
						<div className="flex flex-wrap gap-1.5">
							{data.cities.map((city) => (
								<Badge
									key={city}
									className="border-0 bg-white/15 text-white backdrop-blur-sm"
								>
									{city}
								</Badge>
							))}
						</div>
					)}
				</div>
			</Card>
		</Link>
	);
}
