import { getLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { Button, type TButtonVariantsProps } from "@/shared/ui";

import { getContactEmailByLocale } from "../lib/get-contact-email-by-locale";

type TContactMailtoButtonProps = {
	children: ReactNode;
	variant?: TButtonVariantsProps["variant"];
};

export async function ContactMailtoButton({
	children,
	variant = "default"
}: TContactMailtoButtonProps) {
	const locale = await getLocale();
	const email = getContactEmailByLocale(locale);

	return (
		<Button asChild variant={variant}>
			<a href={`mailto:${email}`}>{children}</a>
		</Button>
	);
}
