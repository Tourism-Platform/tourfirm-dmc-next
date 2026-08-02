import { getSocialPlatformIcon } from "@/shared/config/social-platforms";
import type { TResolvedSocialLink } from "@/shared/types/navigation.types";
import { ButtonSocial } from "@/shared/ui";

interface IFooterSocialProps {
	items: TResolvedSocialLink[];
}

export const FooterSocial = ({ items }: IFooterSocialProps) => (
	<div className="grid grid-cols-5 gap-2.5 sm:grid-cols-6 md:grid-cols-8">
		{items.map(({ key, platform, url }) => (
			<ButtonSocial
				key={key}
				url={url}
				title={platform}
				icon={getSocialPlatformIcon(platform)}
			/>
		))}
	</div>
);
