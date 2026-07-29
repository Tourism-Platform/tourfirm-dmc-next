import { ENUM_PATH } from "@/shared/config";
import type {
	TInformationNavArea,
	TInformationNavCollection,
	TInformationNavItem,
	TInformationNavTree
} from "@/shared/types/information-nav.types";

type TInformationDocSource = {
	id: number | string;
	slug: string;
	title: string;
};

const DEFAULT_AREA_LABELS: Record<TInformationNavCollection, string> = {
	news: "News",
	blog: "Blog",
	"trade-fairs": "Trade fairs"
};

export function getInformationAreaHubHref(
	collection: TInformationNavCollection
): string {
	switch (collection) {
		case "news":
			return ENUM_PATH.COMPANY.NEWS;
		case "blog":
			return ENUM_PATH.DISCOVERY.BLOG;
		case "trade-fairs":
			return ENUM_PATH.COMPANY.TRADE_FAIRS;
	}
}

export function getInformationDocHref(
	collection: TInformationNavCollection,
	slug: string
): string {
	switch (collection) {
		case "news":
			return ENUM_PATH.COMPANY.newsDetail(slug);
		case "blog":
			return ENUM_PATH.DISCOVERY.blogDetail(slug);
		case "trade-fairs":
			return ENUM_PATH.COMPANY.tradeFairDetail(slug);
	}
}

export function resolveInformationAreaLabel(
	collection: TInformationNavCollection,
	label?: string | null
): string {
	const trimmed = label?.trim();

	if (trimmed) {
		return trimmed;
	}

	return DEFAULT_AREA_LABELS[collection];
}

export function mapInformationNavItem(
	collection: TInformationNavCollection,
	doc: TInformationDocSource
): TInformationNavItem {
	return {
		id: String(doc.id),
		slug: doc.slug,
		title: doc.title,
		href: getInformationDocHref(collection, doc.slug)
	};
}

export function buildInformationNavArea(input: {
	key: string;
	collection: TInformationNavCollection;
	label?: string | null;
	docs: TInformationDocSource[];
}): TInformationNavArea {
	return {
		key: input.key,
		collection: input.collection,
		label: resolveInformationAreaLabel(input.collection, input.label),
		hubHref: getInformationAreaHubHref(input.collection),
		items: input.docs.map((doc) =>
			mapInformationNavItem(input.collection, doc)
		)
	};
}

export function buildInformationNavTree(
	areas: TInformationNavArea[]
): TInformationNavTree {
	return { areas };
}
