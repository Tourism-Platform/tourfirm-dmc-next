import { ADMIN_BRAND_NAME, ADMIN_LOGO_SRC } from "../admin-brand.constants";

export function AdminLogo() {
	return (
		<img
			alt={ADMIN_BRAND_NAME}
			className="block h-auto w-[150px]"
			src={ADMIN_LOGO_SRC}
		/>
	);
}
