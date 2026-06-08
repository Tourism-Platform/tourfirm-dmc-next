import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/shared/lib";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui";

const tabVariants = cva(
	"data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg",
	{
		variants: {
			variant: {
				default: "",
				tongue: "data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-accent/50 pl-4 py-2 rounded-t-lg rounded-b-none border-b-2 transition-all cursor-pointer border-transparent text-muted-foreground  hover:!bg-accent hover:!text-accent-foreground hover:!border-primary",
				outline:
					" first:rounded-l-lg last:rounded-r-lg rounded-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-accent/50 border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
				bigOutline:
					"rounded-lg data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-accent/50 border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
			}
		},
		defaultVariants: {
			variant: "default"
		}
	}
);

export const CustomOptionTabs = React.forwardRef<
	React.ComponentRef<typeof Tabs>,
	React.ComponentPropsWithoutRef<typeof Tabs>
>(({ className, ...props }, ref) => (
	<Tabs ref={ref} className={cn("", className)} {...props} />
));
CustomOptionTabs.displayName = "CustomOptionTabs";

export const CustomOptionTabsList = React.forwardRef<
	React.ComponentRef<typeof TabsList>,
	React.ComponentPropsWithoutRef<typeof TabsList>
>(({ className, children, ...props }, ref) => {
	return (
		<TabsList
			ref={ref}
			className={cn("grid bg-transparent", className)}
			{...props}
		>
			{children}
		</TabsList>
	);
});
CustomOptionTabsList.displayName = "CustomOptionTabsList";

type TCustomOptionTabsTriggerProps = React.ComponentPropsWithoutRef<
	typeof TabsTrigger
> &
	VariantProps<typeof tabVariants>;

export const CustomOptionTabsTrigger = React.forwardRef<
	React.ComponentRef<typeof TabsTrigger>,
	TCustomOptionTabsTriggerProps
>(({ variant, className, ...props }, ref) => (
	<TabsTrigger
		ref={ref}
		className={cn(tabVariants({ variant, className }))}
		{...props}
	/>
));
CustomOptionTabsTrigger.displayName = "CustomOptionTabsTrigger";

export const CustomOptionTabsContent = React.forwardRef<
	React.ComponentRef<typeof TabsContent>,
	React.ComponentPropsWithoutRef<typeof TabsContent>
>(({ className, ...props }, ref) => (
	<TabsContent ref={ref} className={cn("", className)} {...props} />
));
CustomOptionTabsContent.displayName = "CustomOptionTabsContent";
