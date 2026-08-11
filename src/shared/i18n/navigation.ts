import { createNavigation } from "next-intl/navigation";

import { routing } from "./routing";

export const {
	Link: NextIntlLink,
	getPathname,
	redirect,
	usePathname,
	useRouter
} = createNavigation(routing);
