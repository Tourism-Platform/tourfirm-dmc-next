import { ENUM_PATH } from "@/shared/config";
import { useAppDispatch } from "@/shared/hooks";
import { useRouter } from "@/shared/i18n";

import { useSignOutMutation } from "@/entities/auth";
import { logout } from "@/entities/user";

export function useSignOutAction() {
	const [signOut, { isLoading, isError }] = useSignOutMutation();
	const dispatch = useAppDispatch();
	const router = useRouter();

	const handleSignOut = async () => {
		try {
			dispatch(logout());
			await signOut();
			router.push(ENUM_PATH.MAIN.ROOT);
		} catch {
			// noop
		}
	};

	return {
		handleSignOut,
		isLoading,
		isError
	};
}
