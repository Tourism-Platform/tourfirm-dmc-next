import { ADMIN_BRAND_NAME, ADMIN_LOGO_SRC } from "../admin-brand.constants";

export function AdminIcon() {
	return (
		<img
			alt={ADMIN_BRAND_NAME}
			className="block size-[30px] object-contain"
			src={ADMIN_LOGO_SRC}
		/>
	);
}
