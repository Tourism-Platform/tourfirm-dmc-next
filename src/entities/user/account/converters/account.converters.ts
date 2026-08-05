import { resolveApiAssetUrl } from "@/shared/lib/api/resolve-api-asset-url";

import type { TAccountBackend, TAccountSchema } from "../types";

export const mapAccountToFrontend = (
	backend: TAccountBackend
): TAccountSchema => ({
	firstName: backend.first_name ?? "",
	lastName: backend.last_name ?? "",
	avatar: resolveApiAssetUrl(backend.profile_picture_path)
});
