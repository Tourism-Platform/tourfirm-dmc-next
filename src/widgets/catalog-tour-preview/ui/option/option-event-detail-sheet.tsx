"use client";

import { ArrowRight } from "lucide-react";
import { type FC, type ReactNode } from "react";

import { cn } from "@/shared/lib";
import { useUiContent } from "@/shared/ui-content";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from "@/shared/ui/shadcn-ui/sheet";

import type { TOptionSheetSource } from "@/entities/tour/preview-tour";

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
			<SheetTitle className="pr-8 text-xl">{source.title}</SheetTitle>
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
	const { preview } = useUiContent();
	const isCompact = variant === "xs";

	return (
		<SheetTrigger asChild className="cursor-pointer">
			<button
				type="button"
				className={cn(
					"text-primary inline-flex w-fit items-center gap-1 underline-offset-4 hover:underline",
					isCompact ? "text-xs" : "text-sm"
				)}
			>
				{preview.option.sections.option.viewDetails}
				<ArrowRight className={isCompact ? "w-3 h-3" : "w-4 h-4"} />
			</button>
		</SheetTrigger>
	);
};

interface IOptionEventDetailSheetProps {
	source: TOptionSheetSource;
	variant?: TTriggerVariant;
	trigger?: ReactNode;
}

export const OptionEventDetailSheet: FC<IOptionEventDetailSheetProps> = ({
	source,
	variant = "sm",
	trigger
}) => (
	<Sheet>
		{trigger ? (
			<SheetTrigger asChild className="cursor-pointer">
				{trigger}
			</SheetTrigger>
		) : (
			<DetailSheetTrigger variant={variant} />
		)}
		<DetailSheetPanel source={source} />
	</Sheet>
);
