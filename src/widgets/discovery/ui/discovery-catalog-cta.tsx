import { ButtonLink } from "@/shared/ui/buttons/ui";
import { CustomSectionHeader } from "@/shared/ui/custom/custom-section-header";

type TProps = {
	title: string;
	description?: string;
	catalogHref: string;
};

export function DiscoveryCatalogCta({
	title,
	description,
	catalogHref
}: TProps) {
	return (
		<section className="bg-muted/40 flex flex-col gap-6 rounded-2xl p-6 sm:p-8">
			<CustomSectionHeader title={title} description={description} />
			<ButtonLink
				href={catalogHref}
				title="Plan this trip"
				variant="default"
				className="w-fit"
			/>
		</section>
	);
}
