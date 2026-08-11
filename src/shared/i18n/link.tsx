"use client";

import type { ComponentProps } from "react";

import { NextIntlLink } from "./navigation";

type TLinkProps = ComponentProps<typeof NextIntlLink>;

/**
 * App Link defaults prefetch off to avoid RSC stampede from dense nav/menus.
 * Pass prefetch={true} only for critical known targets.
 */
export function Link({ prefetch = false, ...props }: TLinkProps) {
	return <NextIntlLink prefetch={prefetch} {...props} />;
}
