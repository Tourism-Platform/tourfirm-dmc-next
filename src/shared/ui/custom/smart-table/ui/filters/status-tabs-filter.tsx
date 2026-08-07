import { type FC } from "react";

import {
	CustomOptionTabs,
	CustomOptionTabsList,
	CustomOptionTabsTrigger
} from "@/shared/ui";

import type { IStatusTabs } from "../../model";

interface IStatusTabsFilterProps {
	statusTabs: IStatusTabs[];
	activeStatusTab?: string;
	onStatusTabChange?: (value: string) => void;
}

export const StatusTabsFilter: FC<IStatusTabsFilterProps> = ({
	statusTabs,
	activeStatusTab,
	onStatusTabChange
}) => {
	return (
		<CustomOptionTabs
			value={activeStatusTab}
			onValueChange={onStatusTabChange}
		>
			<CustomOptionTabsList
				className="grid gap-2"
				style={{
					gridTemplateColumns: `repeat(${statusTabs.length}, minmax(0, 1fr))`
				}}
			>
				{statusTabs.map((tab) => (
					<CustomOptionTabsTrigger key={tab.value} value={tab.value}>
						{tab.label}
					</CustomOptionTabsTrigger>
				))}
			</CustomOptionTabsList>
		</CustomOptionTabs>
	);
};
