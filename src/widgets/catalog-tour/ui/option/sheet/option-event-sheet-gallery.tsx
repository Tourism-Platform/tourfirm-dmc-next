import { type FC } from "react";

import { UploadImagesPreviewer } from "@/shared/ui";

interface IOptionEventSheetGalleryProps {
	images: string[];
}

export const OptionEventSheetGallery: FC<IOptionEventSheetGalleryProps> = ({
	images
}) => {
	if (!images.length) return null;

	return (
		<UploadImagesPreviewer
			images={images.slice(0, 5)}
			gridHeight={220}
			showPrimaryBadge={false}
		/>
	);
};
