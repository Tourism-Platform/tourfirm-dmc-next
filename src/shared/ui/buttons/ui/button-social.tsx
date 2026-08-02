import type { IconType } from "react-icons";

import { cn } from "@/shared/lib/utils";

import { buttonVariants } from "../../shadcn-ui/button-variants";

type TButtonSocialProps = {
	url: string;
	title: string;
	icon: IconType;
	className?: string;
};

export function ButtonSocial({
	url,
	title,
	icon: Icon,
	className
}: TButtonSocialProps) {
	return (
		<a
			href={url}
			target="_blank"
			rel="noopener noreferrer"
			aria-label={title}
			className={cn(
				buttonVariants({ variant: "outline", size: "icon" }),
				"size-9 rounded-full border-border bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground",
				className
			)}
		>
			<Icon className="size-4" />
		</a>
	);
}
