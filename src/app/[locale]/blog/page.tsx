import {
	type TCmsSearchParams,
	buildCmsSegmentsMetadata,
	renderCmsSegmentsPage
} from "@/cms/routing/render-cms-segments-page";

type TProps = {
	params: Promise<{ locale: string }>;
	searchParams: Promise<TCmsSearchParams>;
};

const SEGMENTS = ["blog"] as const;

export async function generateMetadata({ params }: TProps) {
	const { locale } = await params;
	return buildCmsSegmentsMetadata({ locale, segments: [...SEGMENTS] });
}

export default async function BlogHubPage({ params, searchParams }: TProps) {
	const { locale } = await params;
	const query = await searchParams;

	return renderCmsSegmentsPage({
		locale,
		segments: [...SEGMENTS],
		searchParams: query
	});
}
