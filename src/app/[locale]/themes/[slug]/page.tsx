import {
	buildCmsSegmentsMetadata,
	renderCmsSegmentsPage
} from "@/cms/routing/render-cms-segments-page";

type TProps = {
	params: Promise<{ locale: string; slug: string }>;
};

export const dynamic = "force-static";
export const revalidate = 60;

export async function generateMetadata({ params }: TProps) {
	const { locale, slug } = await params;
	return buildCmsSegmentsMetadata({ locale, segments: ["themes", slug] });
}

export default async function ThemeDetailPage({ params }: TProps) {
	const { locale, slug } = await params;

	return renderCmsSegmentsPage({
		locale,
		segments: ["themes", slug]
	});
}
