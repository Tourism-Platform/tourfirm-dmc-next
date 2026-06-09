import { Button } from "@/shared/ui";

import { type IFooterSocialProps, SOCIAL_ICONS } from "../model";

export const FooterSocial = ({ items }: IFooterSocialProps) => (
	<div className="flex items-center gap-3">
		{items.map(({ name, label, path }) => {
			const Icon = SOCIAL_ICONS[name];

			return (
				<Button
					key={name}
					variant="outline"
					size="icon"
					className="size-9 rounded-full border-border bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground"
					asChild
				>
					<a
						href={path}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={label}
					>
						<Icon className="size-4" />
					</a>
				</Button>
			);
		})}
	</div>
);
