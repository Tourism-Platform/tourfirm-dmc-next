"use client";

import type { FC } from "react";

import { cn } from "@/shared/lib/utils";

type TStep = {
	step: number;
	label: string;
	title: string;
};

type TProps = {
	steps: TStep[];
	currentStep: number;
	className?: string;
};

export const BookingStepperCarousel: FC<TProps> = ({
	steps,
	currentStep,
	className
}) => {
	const activeIndex = Math.max(
		0,
		steps.findIndex((item) => item.step === currentStep)
	);

	return (
		<div className={cn("w-full", className)}>
			<div className="overflow-hidden">
				<div
					className="flex transition-transform duration-300 ease-out"
					style={{ transform: `translateX(-${activeIndex * 100}%)` }}
				>
					{steps.map(({ step, label, title }) => (
						<div
							key={step}
							className="flex w-full shrink-0 items-center justify-center gap-3"
						>
							<span
								className={cn(
									"flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
									step === currentStep
										? "bg-primary text-primary-foreground"
										: step < currentStep
											? "bg-primary/20 text-primary"
											: "bg-muted text-muted-foreground"
								)}
							>
								{step}
							</span>
							<div className="flex min-w-0 flex-col items-center text-center">
								<span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
									{label}
								</span>
								<span className="truncate text-sm font-medium text-foreground">
									{title}
								</span>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="mt-4 flex items-center justify-center gap-2">
				{steps.map(({ step }, index) => (
					<span
						key={step}
						className={cn(
							"h-1.5 rounded-full transition-all duration-300",
							index === activeIndex
								? "w-6 bg-primary"
								: "w-1.5 bg-muted-foreground/30"
						)}
						aria-hidden
					/>
				))}
			</div>
		</div>
	);
};
