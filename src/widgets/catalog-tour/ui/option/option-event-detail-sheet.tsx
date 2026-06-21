"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { type FC } from "react";

import { cn } from "@/shared/lib";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from "@/shared/ui/shadcn-ui/sheet";

import type { TOptionSheetSource } from "@/entities/tour/catalog";

import { OptionEventSheetBody } from "./sheet";

type TTriggerVariant = "sm" | "xs";

interface IDetailSheetPanelProps {
	source: TOptionSheetSource;
}

const DetailSheetPanel: FC<IDetailSheetPanelProps> = ({ source }) => (
	<SheetContent
		side="right"
		className="flex h-full w-full flex-col gap-0 p-0 sm:max-w-[540px]"
	>
		<SheetHeader className="shrink-0 space-y-0 px-6 pt-6 pb-4 text-left">
			<SheetTitle className="text-xl pr-8">{source.title}</SheetTitle>
			<SheetDescription className="sr-only">
				{source.title}
			</SheetDescription>
		</SheetHeader>

		<div className="flex-1 overflow-y-auto px-6 pb-6">
			<OptionEventSheetBody sheet={source.sheet} />
		</div>
	</SheetContent>
);

interface IDetailSheetTriggerProps {
	variant: TTriggerVariant;
}

const DetailSheetTrigger: FC<IDetailSheetTriggerProps> = ({ variant }) => {
	const t = useTranslations("catalog_tour_option_page");
	const isCompact = variant === "xs";

	return (
		<SheetTrigger asChild className="cursor-pointer">
			<button
				type="button"
				className={cn(
					"text-primary hover:underline underline-offset-4 w-fit",
					isCompact ? "text-xs flex items-center gap-1" : "text-sm"
				)}
			>
				{t("sections.option.view_details")}
				{isCompact && <ArrowRight className="w-3 h-3" />}
			</button>
		</SheetTrigger>
	);
};

interface IOptionEventDetailSheetProps {
	source: TOptionSheetSource;
	variant?: TTriggerVariant;
}

export const OptionEventDetailSheet: FC<IOptionEventDetailSheetProps> = ({
	source,
	variant = "sm"
}) => (
	<Sheet>
		<DetailSheetTrigger variant={variant} />
		<DetailSheetPanel source={source} />
	</Sheet>
);
