import { Badge } from "@/shared/ui/shadcn-ui/badge";

type TProps = {
	type?: string;
	duration?: string | null;
	location?: string;
	themes?: string[];
};

export function ExperienceMetaBar({
	type,
	duration,
	location,
	themes = []
}: TProps) {
	return (
		<section className="flex flex-col gap-4 rounded-2xl border p-5 sm:p-6">
			<div className="flex flex-wrap gap-2">
				{type ? <Badge variant="secondary">{type}</Badge> : null}
				{duration ? <Badge variant="outline">{duration}</Badge> : null}
				{location ? <Badge variant="outline">{location}</Badge> : null}
			</div>
			{themes.length ? (
				<div className="flex flex-wrap gap-2">
					{themes.map((theme) => (
						<Badge key={theme} variant="secondary">
							{theme}
						</Badge>
					))}
				</div>
			) : null}
		</section>
	);
}
