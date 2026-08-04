"use client";

import { Send } from "lucide-react";
import { useLocale } from "next-intl";
import { type FormEvent, useState } from "react";

import { cn } from "@/shared/lib/utils";
import {
	Button,
	Checkbox,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Input,
	Label,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	type TButtonVariantsProps,
	Textarea,
	buttonVariants
} from "@/shared/ui/shadcn-ui";

import {
	type TLeadRequestFormValues,
	type TLeadRequestType,
	buildLeadRequestMailto,
	getLeadRequestCopy
} from "../lib/lead-request-copy";

type TLeadRequestButtonProps = {
	title: string;
	variant?: TButtonVariantsProps["variant"];
	className?: string;
};

const REQUEST_TYPES: TLeadRequestType[] = [
	"tour",
	"route",
	"business",
	"partnership",
	"other"
];

const INITIAL_VALUES: TLeadRequestFormValues = {
	name: "",
	email: "",
	phone: "",
	requestType: "tour",
	message: "",
	consent: false
};

export function LeadRequestButton({
	title,
	variant = "default",
	className
}: TLeadRequestButtonProps) {
	const locale = useLocale();
	const copy = getLeadRequestCopy(locale);
	const [open, setOpen] = useState(false);
	const [values, setValues] =
		useState<TLeadRequestFormValues>(INITIAL_VALUES);

	const onSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!values.consent || !values.name.trim() || !values.email.trim()) {
			return;
		}

		window.location.href = buildLeadRequestMailto(locale, values);
		setOpen(false);
		setValues(INITIAL_VALUES);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger
				className={cn(buttonVariants({ variant }), className)}
			>
				{title}
			</DialogTrigger>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>{copy.dialogTitle}</DialogTitle>
					<DialogDescription>
						{copy.dialogDescription}
					</DialogDescription>
				</DialogHeader>

				<form className="flex flex-col gap-4" onSubmit={onSubmit}>
					<div className="flex flex-col gap-2">
						<Label htmlFor="lead-name">{copy.name}</Label>
						<Input
							id="lead-name"
							required
							value={values.name}
							onChange={(event) =>
								setValues((prev) => ({
									...prev,
									name: event.target.value
								}))
							}
						/>
					</div>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div className="flex flex-col gap-2">
							<Label htmlFor="lead-email">{copy.email}</Label>
							<Input
								id="lead-email"
								type="email"
								required
								value={values.email}
								onChange={(event) =>
									setValues((prev) => ({
										...prev,
										email: event.target.value
									}))
								}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="lead-phone">{copy.phone}</Label>
							<Input
								id="lead-phone"
								value={values.phone}
								onChange={(event) =>
									setValues((prev) => ({
										...prev,
										phone: event.target.value
									}))
								}
							/>
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<Label htmlFor="lead-type">{copy.requestType}</Label>
						<Select
							value={values.requestType}
							onValueChange={(value) =>
								setValues((prev) => ({
									...prev,
									requestType: value as TLeadRequestType
								}))
							}
						>
							<SelectTrigger id="lead-type" className="w-full">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{REQUEST_TYPES.map((type) => (
									<SelectItem key={type} value={type}>
										{copy.requestTypes[type]}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="flex flex-col gap-2">
						<Label htmlFor="lead-message">{copy.message}</Label>
						<Textarea
							id="lead-message"
							rows={5}
							placeholder={copy.messagePlaceholder}
							value={values.message}
							onChange={(event) =>
								setValues((prev) => ({
									...prev,
									message: event.target.value
								}))
							}
						/>
					</div>

					<label className="flex items-start gap-3 text-sm text-muted-foreground">
						<Checkbox
							checked={values.consent}
							onCheckedChange={(checked) =>
								setValues((prev) => ({
									...prev,
									consent: checked === true
								}))
							}
							className="mt-0.5"
						/>
						<span>{copy.consent}</span>
					</label>

					<div>
						<Button type="submit" disabled={!values.consent}>
							{copy.submit}
							<Send className="size-4" />
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
