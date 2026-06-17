import type { TContactDetailItemProps } from "../types/contact-detail-item.types";

export function ContactDetailItem({
	icon: Icon,
	label,
	children
}: TContactDetailItemProps) {
	return (
		<div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
			<dt className="text-foreground flex min-w-40 items-start gap-2 text-sm font-medium sm:text-base">
				{Icon ? (
					<Icon className="text-primary mt-0.5 size-4 shrink-0" />
				) : null}
				{label}
			</dt>
			<dd className="text-muted-foreground text-sm sm:text-base">
				{children}
			</dd>
		</div>
	);
}
