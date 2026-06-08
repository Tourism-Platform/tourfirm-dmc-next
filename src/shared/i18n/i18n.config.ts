import common from "../../../messages/en/common.json";
import footer from "../../../messages/en/footer.json";
import header from "../../../messages/en/header.json";

import type { TNestedKeyOf } from "./types";

export type TCommon = typeof common;
export type THeader = typeof header;
export type TFooter = typeof footer;

export type TResources = {
	common: TCommon;
	header: THeader;
	footer: TFooter;
};

export const MESSAGE_NAMESPACES = ["common", "header", "footer"] as const;

export type TMessageNamespace = (typeof MESSAGE_NAMESPACES)[number];

export type TCommonKeys = TNestedKeyOf<TCommon>;
export type THeaderKeys = TNestedKeyOf<THeader>;
export type TFooterKeys = TNestedKeyOf<TFooter>;
