"use client";

import { useRequireAuth } from "@/features/auth";

import { Orders } from "@/widgets/booking";

export function BookingPage() {
	const { isReady, isChecking } = useRequireAuth();

	if (isChecking || !isReady) {
		return null;
	}

	return (
		<div className="flex flex-1 flex-col pt-10">
			<Orders />
		</div>
	);
}
