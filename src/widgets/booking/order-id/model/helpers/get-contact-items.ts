import type { TUiOrders } from "@/shared/ui-content";

import { type IOrderOperatorInfo } from "@/entities/booking";

import { type IInfoItem } from "../types";

const empty = "-";

export const getContactItems = (
	operator: IOrderOperatorInfo | null | undefined,
	fields: TUiOrders["contactInfo"]["fields"]
): IInfoItem[] => {
	if (!operator) {
		return [
			{
				label: fields.client,
				value: empty
			},
			{
				label: fields.email,
				value: empty
			},
			{
				label: fields.phone,
				value: empty
			}
		];
	}

	const contactName =
		operator.contactPerson?.trim() || operator.name?.trim() || empty;

	return [
		{
			label: fields.client,
			value: contactName
		},
		{
			label: fields.email,
			value: operator.contactEmail || empty
		},
		{
			label: fields.phone,
			value: operator.contactPhone || empty
		}
	];
};
