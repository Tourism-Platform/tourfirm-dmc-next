import { Cms } from "@/widgets/cms";

import { TEAM_PROFILE_PREVIEW_SECTIONS } from "../model/team-profile-preview.blocks";

export function TeamProfilePreviewPage() {
	return <Cms sections={TEAM_PROFILE_PREVIEW_SECTIONS} />;
}
