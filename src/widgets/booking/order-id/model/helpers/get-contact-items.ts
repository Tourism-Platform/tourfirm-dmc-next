import type { TUiOrders } from "@/shared/ui-content";

import { type IOrderUserInfo } from "@/entities/booking";

import { type IInfoItem } from "../types";

const empty = "-";

export const getContactItems = (
	user: IOrderUserInfo | null | undefined,
	fields: TUiOrders["contactInfo"]["fields"]
): IInfoItem[] => {
	if (!user) {
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

	const clientName =
		[user.firstName, user.lastName]
			.filter((part) => part?.trim())
			.join(" ")
			.trim() || empty;

	return [
		{
			label: fields.client,
			value: clientName
		},
		{
			label: fields.email,
			value: user.email || empty
		},
		{
			label: fields.phone,
			value: user.phoneNumber || empty
		}
	];
};
