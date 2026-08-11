import { InvoiceStatus } from "@/shared/api";

import type { ENUM_INVOICE_STATUS_TYPE } from "../types";

export const INVOICE_STATUS_VARIANTS: Record<
	ENUM_INVOICE_STATUS_TYPE,
	"default" | "green" | "red" | "yellow"
> = {
	[InvoiceStatus.Draft]: "default",
	[InvoiceStatus.Sent]: "default",
	[InvoiceStatus.Partial]: "yellow",
	[InvoiceStatus.Paid]: "green",
	[InvoiceStatus.Overdue]: "red",
	[InvoiceStatus.Cancelled]: "default"
};
