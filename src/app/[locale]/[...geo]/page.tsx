import {
	buildCmsSegmentsMetadata,
	renderCmsSegmentsPage
} from "@/cms/routing/render-cms-segments-page";

/**
 * Do not await searchParams/cookies/headers here — they force no-store on the
 * whole catch-all. Discovery hubs that need ?page/theme/country live in
 * dedicated routes under app/[locale]/* (more specific than [...geo]).
 *
 * No generateStaticParams: geo URLs are on-demand ISR (force-static +
 * revalidate). Payload finders use unstable_cache; first hit fills FRC.
 */
export const dynamic = "force-static";
export const revalidate = 60;

type TProps = {
	params: Promise<{ locale: string; geo: string[] }>;
};

export async function generateMetadata({ params }: TProps) {
	const { locale, geo } = await params;

	return buildCmsSegmentsMetadata({
		locale,
		segments: geo ?? []
	});
}

export default async function GeoCatchAllRoute({ params }: TProps) {
	const { locale, geo } = await params;

	return renderCmsSegmentsPage({
		locale,
		segments: geo ?? []
	});
}
