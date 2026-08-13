import {
	buildCmsSegmentsMetadata,
	renderCmsSegmentsPage
} from "@/cms/routing/render-cms-segments-page";

type TProps = {
	params: Promise<{ locale: string; slug: string }>;
};

export const revalidate = 60;

export async function generateMetadata({ params }: TProps) {
	const { locale, slug } = await params;
	return buildCmsSegmentsMetadata({
		locale,
		segments: ["company", "team", slug]
	});
}

export default async function CompanyTeamPage({ params }: TProps) {
	const { locale, slug } = await params;

	return renderCmsSegmentsPage({
		locale,
		segments: ["company", "team", slug]
	});
}
