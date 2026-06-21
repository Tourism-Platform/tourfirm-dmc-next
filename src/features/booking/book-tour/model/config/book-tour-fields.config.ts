import type { TBookTourFormField } from "../types/book-tour-form.types";

export const BOOK_TOUR_FORM_FIELDS: TBookTourFormField[] = [
	{
		key: "fullName",
		label: "fields.full_name.label",
		placeholder: "fields.full_name.placeholder",
		fieldType: "input"
	},
	{
		key: "email",
		label: "fields.email.label",
		placeholder: "fields.email.placeholder",
		fieldType: "input",
		type: "email"
	},
	{
		key: "phone",
		label: "fields.phone.label",
		placeholder: "fields.phone.placeholder",
		fieldType: "phone"
	},
	{
		key: "dates",
		label: "fields.dates.label",
		placeholder: "fields.dates.placeholder",
		fieldType: "dateRange",
		numberOfMonths: 1,
		popoverModal: false
	},
	{
		key: "groupSize",
		label: "fields.group_size.label",
		placeholder: "fields.group_size.placeholder",
		fieldType: "input",
		type: "number",
		min: 1
	},
	{
		key: "message",
		label: "fields.message.label",
		placeholder: "fields.message.placeholder",
		fieldType: "textarea"
	}
];
