import { getLucideIcon } from "@/shared/lib/get-lucide-icon";
import type { TResolvedSocialLink } from "@/shared/types/navigation.types";
import { ButtonSocial } from "@/shared/ui";

interface IFooterSocialProps {
	items: TResolvedSocialLink[];
}

export const FooterSocial = ({ items }: IFooterSocialProps) => (
	<div className="flex items-center gap-3">
		{items.map(({ key, platform, url }) => (
			<ButtonSocial
				key={key}
				url={url}
				title={platform}
				icon={getLucideIcon(platform)}
			/>
		))}
	</div>
);
