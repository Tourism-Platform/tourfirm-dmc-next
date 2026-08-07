"use client";

import { type FC } from "react";

import { getCountryLabel } from "@/shared/lib/countries";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	withErrorBoundary
} from "@/shared/ui";
import { useUiContent } from "@/shared/ui-content";

import { Gender, type IBookingPax } from "@/entities/booking";

type TOrderPaxReviewProps = {
	items?: IBookingPax[];
};

const OrderPaxReviewBase: FC<TOrderPaxReviewProps> = ({ items = [] }) => {
	const { orders } = useUiContent();
	const labels = orders.paxInformation.table;

	return (
		<Card>
			<CardHeader className="text-lg font-semibold">
				<CardTitle>{orders.paxInformation.title}</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				{items.length === 0 ? (
					<p className="text-sm text-muted-foreground">-</p>
				) : (
					items.map((pax) => (
						<div
							key={pax.id}
							className="grid gap-3 rounded-lg border border-border/60 p-4 sm:grid-cols-2 lg:grid-cols-3"
						>
							<div className="flex flex-col gap-1">
								<span className="text-xs text-muted-foreground">
									{labels.fullName}
								</span>
								<span className="text-sm font-medium">
									{pax.name}
								</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="text-xs text-muted-foreground">
									{labels.gender}
								</span>
								<span className="text-sm font-medium">
									{pax.gender === Gender.M
										? labels.genders.male
										: labels.genders.female}
								</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="text-xs text-muted-foreground">
									{labels.nationality}
								</span>
								<span className="text-sm font-medium">
									{getCountryLabel(pax.nationality, "en")}
								</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="text-xs text-muted-foreground">
									{labels.dateOfBirth}
								</span>
								<span className="text-sm font-medium">
									{pax.dateOfBirth}
								</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="text-xs text-muted-foreground">
									{labels.passportNumber}
								</span>
								<span className="text-sm font-medium">
									{pax.passportNum}
								</span>
							</div>
							<div className="flex flex-col gap-1">
								<span className="text-xs text-muted-foreground">
									{labels.expiredDate}
								</span>
								<span className="text-sm font-medium">
									{pax.passportExpiryDate}
								</span>
							</div>
							{pax.comment ? (
								<div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-3">
									<span className="text-xs text-muted-foreground">
										{labels.comment}
									</span>
									<span className="text-sm font-medium">
										{pax.comment}
									</span>
								</div>
							) : null}
						</div>
					))
				)}
			</CardContent>
		</Card>
	);
};

export const OrderPaxReview = withErrorBoundary(OrderPaxReviewBase);
