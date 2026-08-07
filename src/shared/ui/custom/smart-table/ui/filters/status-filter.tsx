import { FilterIcon } from "lucide-react";
import { type FC } from "react";

import {
	Button,
	Checkbox,
	Label,
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/shared/ui";

interface IStatusFilterProps {
	id: string;
	selectedStatuses: string[];
	uniqueStatusValues: string[];
	handleStatusChange: (checked: boolean, value: string) => void;
	statusOptions?: { label: string; value: string }[];
}

export const StatusFilter: FC<IStatusFilterProps> = ({
	id,
	selectedStatuses,
	uniqueStatusValues,
	handleStatusChange,
	statusOptions
}) => {
	const options =
		statusOptions ??
		uniqueStatusValues.map((v) => ({ label: v, value: v }));

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline">
					<FilterIcon
						className="-ms-1 opacity-60"
						size={16}
						aria-hidden="true"
					/>
					Status
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto min-w-36 p-3" align="start">
				<div className="space-y-3">
					<div className="space-y-3">
						{options.map((option, i) => (
							<div
								key={option.value}
								className="flex items-center gap-2"
							>
								<Checkbox
									id={`${id}-${i}`}
									checked={selectedStatuses.includes(
										option.value
									)}
									onCheckedChange={(checked: boolean) =>
										handleStatusChange(
											checked,
											option.value
										)
									}
								/>
								<Label
									htmlFor={`${id}-${i}`}
									className="flex grow justify-between gap-2 font-normal"
								>
									{option.label}
								</Label>
							</div>
						))}
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
};
