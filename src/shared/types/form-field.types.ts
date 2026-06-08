import type { LucideIcon } from "lucide-react";

import type {
	IGeoSelectOption,
	TGeoFormValue
} from "@/shared/types/geo-form.types";
import type {
	BadgeVariant,
	CustomAutocompleteOption,
	CustomGeoSelectProps,
	MultipleSelectorDisplayMode,
	Option as MultipleSelectorOption,
	SelectPickerOption
} from "@/shared/ui";

// Универсальные типы ключей и идентификаторов
type TGenericLabel = string;
type TGenericKey = string;

// Базовый интерфейс формы
interface IFormBase<L = TGenericLabel, K = TGenericKey> {
	label?: L;
	key: K;
	disabled?: boolean;
	className?: string;
}

// Конкретные типы полей
type TFormInput<L = TGenericLabel, K = TGenericKey> = IFormBase<L, K> & {
	fieldType?: "input";
	placeholder: L;
	type?: string;
	min?: number;
	max?: number;
	step?: string;
};

type TFormPassword<L = TGenericLabel, K = TGenericKey> = IFormBase<L, K> & {
	fieldType: "password";
	placeholder: L;
};

type TFormPhone<L = TGenericLabel, K = TGenericKey> = IFormBase<L, K> & {
	fieldType: "phone";
	placeholder: L;
};

type TFormTextarea<L = TGenericLabel, K = TGenericKey> = IFormBase<L, K> & {
	fieldType: "textarea";
	placeholder: L;
	rows?: number;
};

type TFormOptional<L = TGenericLabel, K = TGenericKey> = IFormBase<L, K> & {
	fieldType: "date" | "time" | "editor";
	placeholder?: L;
};

type TFormSelect<L = TGenericLabel, K = TGenericKey> = IFormBase<L, K> & {
	fieldType: "select";
	options: SelectPickerOption[];
	placeholder?: L;
	defaultValue?: string;
};

type TFormMultiSelect<L = TGenericLabel, K = TGenericKey> = IFormBase<L, K> & {
	fieldType: "multiselect";
	options: MultipleSelectorOption[];
	placeholder?: string;
	displayMode?: MultipleSelectorDisplayMode;
	badgeVariant?: BadgeVariant;
	hideClearAllButton?: boolean;
};

type TFormDateRange<L = TGenericLabel, K = TGenericKey> = IFormBase<L, K> & {
	fieldType: "dateRange";
	placeholder?: L;
};

type TFormDatePicker<L = TGenericLabel, K = TGenericKey> = IFormBase<L, K> & {
	fieldType: "datePicker";
};

type TFormSwitch<L = TGenericLabel, K = TGenericKey> = IFormBase<L, K> & {
	fieldType: "switch";
	description?: L;
};

type TFormAutocomplete<L = TGenericLabel, K = TGenericKey> = IFormBase<L, K> & {
	fieldType: "autocomplete";
	options: CustomAutocompleteOption[];
	placeholder?: string;
	emptyText?: string;
	icon?: LucideIcon;
};

export type TFormGeo<L = TGenericLabel, K = TGenericKey> = IFormBase<L, K> & {
	fieldType: "geo";
	options: IGeoSelectOption[];
	onQueryChange: CustomGeoSelectProps["onQueryChange"];
	isLoading?: boolean;
	minQueryLength?: number;
	placeholder?: string;
	emptyText?: string;
	icon?: LucideIcon;
	defaultValue?: TGeoFormValue | null;
};

// Универсальный тип формы
export type TFormField<L = TGenericLabel, K = TGenericKey> =
	| TFormInput<L, K>
	| TFormPassword<L, K>
	| TFormPhone<L, K>
	| TFormTextarea<L, K>
	| TFormOptional<L, K>
	| TFormSelect<L, K>
	| TFormMultiSelect<L, K>
	| TFormSwitch<L, K>
	| TFormAutocomplete<L, K>
	| TFormGeo<L, K>
	| TFormDateRange<L, K>
	| TFormDatePicker<L, K>;
