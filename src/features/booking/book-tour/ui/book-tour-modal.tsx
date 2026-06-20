"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { type FC, useState } from "react";
import { useForm } from "react-hook-form";

import {
	Button,
	CustomField,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	Form
} from "@/shared/ui";

import type { ICatalogTourCard } from "@/entities/tour";

import {
	BOOK_TOUR_FORM_FIELDS,
	type TBookTourForm,
	bookTourSchema
} from "../model";

interface IBookTourModalProps {
	tour: Pick<ICatalogTourCard, "id" | "title">;
	triggerClassName?: string;
}

const getDefaultValues = (
	tour: Pick<ICatalogTourCard, "id" | "title">
): TBookTourForm => ({
	tourId: tour.id,
	tourTitle: tour.title,
	fullName: "",
	email: "",
	phone: "",
	dates: undefined,
	groupSize: 1,
	message: ""
});

export const BookTourModal: FC<IBookTourModalProps> = ({
	tour,
	triggerClassName
}) => {
	const t = useTranslations("booking_tour_modal");
	const [open, setOpen] = useState(false);

	const form = useForm<TBookTourForm>({
		resolver: zodResolver(bookTourSchema),
		defaultValues: getDefaultValues(tour)
	});

	const handleOpenChange = (nextOpen: boolean) => {
		if (nextOpen) {
			form.reset(getDefaultValues(tour));
		} else {
			form.reset();
		}

		setOpen(nextOpen);
	};

	const onSubmit = () => {
		// TODO: email/API — bookTourSchema.parse(form.getValues())
		handleOpenChange(false);
	};

	return (
		<>
			<Button
				type="button"
				className={triggerClassName ?? "w-full"}
				onClick={() => handleOpenChange(true)}
			>
				{t("trigger")}
			</Button>
			<Dialog open={open} onOpenChange={handleOpenChange}>
				<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
					<DialogHeader>
						<DialogTitle>{t("title")}</DialogTitle>
						<DialogDescription>
							{t("description")}
						</DialogDescription>
					</DialogHeader>

					<Form {...form}>
						<form
							className="grid gap-4"
							onSubmit={form.handleSubmit(onSubmit)}
						>
							{BOOK_TOUR_FORM_FIELDS.map(({ key, ...item }) => (
								<CustomField
									key={key}
									name={key}
									control={form.control}
									t={t}
									className="mb-0"
									{...item}
								/>
							))}
							<p className="text-muted-foreground text-xs">
								{t("disclaimer")}
							</p>
							<DialogFooter>
								<Button type="submit">
									{t("actions.submit")}
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</>
	);
};
