import type { TWidgetModelBuilder } from "./widget-model.types";
import type { Experience } from "@/payload-types";

export const buildExperienceMetaModel: TWidgetModelBuilder = ({
	entityResult
}) => {
	const experience = entityResult.rawDocument as Experience | null;

	if (!experience) {
		return null;
	}

	const country =
		typeof experience.country === "object" ? experience.country : null;
	const city = typeof experience.city === "object" ? experience.city : null;
	const themes =
		experience.themes
			?.map((theme) =>
				typeof theme === "object" ? theme.title : undefined
			)
			.filter((title): title is string => Boolean(title)) ?? [];
	const location = [city?.title, country?.title].filter(Boolean).join(", ");

	return {
		key: "experienceMeta",
		props: {
			type: experience.type
				? experience.type.replaceAll("_", " ").toLowerCase()
				: undefined,
			duration: experience.duration,
			location,
			themes
		}
	};
};
