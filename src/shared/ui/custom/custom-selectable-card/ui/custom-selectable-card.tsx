import { type FC, type KeyboardEvent, type ReactNode } from "react";

import { cn } from "@/shared/lib";

interface ICustomSelectableCardProps {
	selected: boolean;
	onSelect: () => void;
	children: ReactNode;
	className?: string;
	disabled?: boolean;
}

export const CustomSelectableCard: FC<ICustomSelectableCardProps> = ({
	selected,
	onSelect,
	children,
	className,
	disabled = false
}) => {
	const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (disabled) return;
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			onSelect();
		}
	};

	return (
		<div
			role="button"
			tabIndex={disabled ? -1 : 0}
			aria-pressed={selected}
			aria-disabled={disabled}
			data-selected={selected}
			onClick={() => !disabled && onSelect()}
			onKeyDown={handleKeyDown}
			className={cn(
				"relative w-full cursor-pointer rounded-xl text-left outline-none transition-[box-shadow,ring] duration-150",
				"focus-visible:ring-[3px] focus-visible:ring-ring/50",
				selected &&
					"ring-2 ring-primary/30 shadow-sm shadow-primary/10",
				disabled && "pointer-events-none opacity-50",
				className
			)}
		>
			<span
				aria-hidden
				className={cn(
					"pointer-events-none absolute top-3 right-3 z-10 size-2 rounded-full bg-primary transition-opacity",
					selected ? "opacity-100" : "opacity-0"
				)}
			/>
			{children}
		</div>
	);
};
