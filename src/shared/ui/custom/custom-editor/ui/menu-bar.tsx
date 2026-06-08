import { type Editor } from "@tiptap/react";
import { Redo, Undo } from "lucide-react";
import { type FC } from "react";

import {
	Button,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from "@/shared/ui";

import {
	EDITOR_STARTER_ITEMS_LIST,
	EDITOR_TEXT_ALIGN_ITEMS_LIST
} from "../model";

import { MenuTooltip } from "./menu-tooltip";

interface IMenuBarProps {
	editor: Editor | null;
}

export const MenuBar: FC<IMenuBarProps> = ({ editor }) => {
	if (!editor) {
		return null;
	}
	const STARTER_LIST = EDITOR_STARTER_ITEMS_LIST(editor);
	const TEXT_ALIGN_LIST = EDITOR_TEXT_ALIGN_ITEMS_LIST(editor);
	return (
		<div className="flex items-center flex-wrap gap-1 border-t border-input  p-2 bg-card  shrink-0">
			<TooltipProvider>
				<div className="flex items-center gap-1 flex-wrap">
					{STARTER_LIST.map((item) => (
						<MenuTooltip key={item?.description} item={item} />
					))}
				</div>

				<div className="w-px h-6 bg-border mx-2"></div>

				<div className="flex items-center gap-1 flex-wrap">
					{TEXT_ALIGN_LIST.map((item) => (
						<MenuTooltip key={item?.description} item={item} />
					))}
				</div>

				<div className="w-px h-6 bg-border mx-2"></div>

				<div className="flex flex-wrap gap-1">
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								size={"sm"}
								variant={"ghost"}
								type="button"
								onClick={() =>
									editor.chain().focus().undo().run()
								}
								disabled={!editor.can().undo()}
							>
								<Undo />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Undo</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								size={"sm"}
								variant={"ghost"}
								type="button"
								onClick={() =>
									editor.chain().focus().redo().run()
								}
								disabled={!editor.can().redo()}
							>
								<Redo />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Redo</TooltipContent>
					</Tooltip>
				</div>
			</TooltipProvider>
		</div>
	);
};
