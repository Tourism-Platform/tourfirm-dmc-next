import { type FC } from "react";

import { cn } from "@/shared/lib";
import { Toggle, Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui";

import { type IEditorStarterItem } from "../model";

interface IMenuTooltipProps {
	item: IEditorStarterItem;
}

export const MenuTooltip: FC<IMenuTooltipProps> = ({ item }) => {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Toggle
					size={"sm"}
					pressed={item?.pressed}
					onPressedChange={item?.onPressedChange}
					className={cn(
						item?.pressed && "bg-muted text-muted-foreground"
					)}
				>
					<item.icon />
				</Toggle>
			</TooltipTrigger>
			<TooltipContent>{item?.description}</TooltipContent>
		</Tooltip>
	);
};
