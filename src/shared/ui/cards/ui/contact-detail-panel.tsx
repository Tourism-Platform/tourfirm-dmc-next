import { Card } from "../../shadcn-ui/card";
import type { TContactDetailPanelProps } from "../types/contact-detail-panel.types";

export function ContactDetailPanel({ children }: TContactDetailPanelProps) {
	return (
		<Card className="gap-0 py-0 shadow-none p-5 sm:p-6">
			<dl className="flex flex-col gap-4 sm:gap-5">{children}</dl>
		</Card>
	);
}
