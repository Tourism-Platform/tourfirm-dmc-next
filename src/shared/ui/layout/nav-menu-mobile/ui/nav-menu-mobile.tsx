import type { FC } from "react";

import {
	Button,
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/shared/ui";

import type { INavMobileItemBase } from "../model";

interface INavMenuMobileProps {
	navItems: INavMobileItemBase[];
}

export const NavMenuMobile: FC<INavMenuMobileProps> = ({ navItems }) => {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					className="group size-8 md:hidden"
					variant="ghost"
					size="icon"
				>
					<svg
						className="pointer-events-none"
						width={16}
						height={16}
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M4 12L20 12"
							className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
						/>
						<path
							d="M4 12H20"
							className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
						/>
						<path
							d="M4 12H20"
							className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
						/>
					</svg>
				</Button>
			</PopoverTrigger>
			<PopoverContent align="start" className="w-64 p-1 md:hidden">
				<NavigationMenu className="max-w-none *:w-full">
					<NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
						{navItems.map((link, index) => (
							<NavigationMenuItem key={index} className="w-full">
								{link.submenu ? (
									<>
										<div className="text-muted-foreground px-2 py-1.5 text-xs font-medium">
											{link.label}
										</div>
										<ul>
											{link?.items?.map(
												(item, itemIndex) => (
													<li key={itemIndex}>
														<NavigationMenuLink
															href={item.href}
															className="py-1.5"
														>
															{item.label}
														</NavigationMenuLink>
													</li>
												)
											)}
										</ul>
									</>
								) : (
									<NavigationMenuLink
										href={link.href}
										className="py-1.5"
									>
										{link.label}
									</NavigationMenuLink>
								)}
								{/* Add separator between different types of items */}
								{index < navItems.length - 1 &&
									// Show separator if:
									// 1. One is submenu and one is simple link OR
									// 2. Both are submenus but with different types
									((!link.submenu &&
										navItems[index + 1].submenu) ||
										(link.submenu &&
											!navItems[index + 1].submenu) ||
										(link.submenu &&
											navItems[index + 1].submenu &&
											link.type !==
												navItems[index + 1].type)) && (
										<div
											role="separator"
											aria-orientation="horizontal"
											className="bg-border -mx-1 my-1 h-px w-full"
										/>
									)}
							</NavigationMenuItem>
						))}
					</NavigationMenuList>
				</NavigationMenu>
			</PopoverContent>
		</Popover>
	);
};
