import { getLucideIcon } from "@/shared/lib/get-lucide-icon";
import type { TResolvedSocialLink } from "@/shared/types/navigation.types";
import { Button } from "@/shared/ui";

interface IFooterSocialProps {
	items: TResolvedSocialLink[];
}

export const FooterSocial = ({ items }: IFooterSocialProps) => (
	<div className="flex items-center gap-3">
		{items.map(({ key, platform, url }) => {
			const Icon = getLucideIcon(platform);

			return (
				<Button
					key={key}
					variant="outline"
					size="icon"
					className="size-9 rounded-full border-border bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground"
					asChild
				>
					<a
						href={url}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={platform}
					>
						<Icon className="size-4" />
					</a>
				</Button>
			);
		})}
	</div>
);
