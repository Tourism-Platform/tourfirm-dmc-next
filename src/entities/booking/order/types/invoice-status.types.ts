import { InvoiceStatus } from "@/shared/api";

export const ENUM_INVOICE_STATUS = {
	DRAFT: InvoiceStatus.Draft,
	SENT: InvoiceStatus.Sent,
	PARTIAL: InvoiceStatus.Partial,
	PAID: InvoiceStatus.Paid,
	OVERDUE: InvoiceStatus.Overdue,
	CANCELLED: InvoiceStatus.Cancelled
} as const;

export type ENUM_INVOICE_STATUS_TYPE =
	(typeof ENUM_INVOICE_STATUS)[keyof typeof ENUM_INVOICE_STATUS];
