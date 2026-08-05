import { UserRoles } from "@/shared/api";

import type { IAuthAccount, TAuthAccountBackend } from "../types";

export const mapAuthAccountToFrontend = (
	user: TAuthAccountBackend
): IAuthAccount => ({
	id: user.id,
	email: user.email,
	role: user.role || UserRoles.AuthenticatedUser,
	picture: user.picture ?? null,
	agencyId: user.agency_id ?? null,
	operatorId: user.operator_id ?? null
});
