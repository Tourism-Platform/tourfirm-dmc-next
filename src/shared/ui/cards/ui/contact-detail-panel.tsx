import type { TContactDetailPanelProps } from "../types/contact-detail-panel.types";

export function ContactDetailPanel({ children }: TContactDetailPanelProps) {
	return (
		<dl className="bg-card flex flex-col gap-4 rounded-xl border p-5 sm:gap-5 sm:p-6">
			{children}
		</dl>
	);
}
