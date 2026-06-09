import type { ReactNode } from "react";

import { Toaster } from "@/shared/ui";

import { WithMsw } from "./with-msw";
import { WithStore } from "./with-store";
import { ThemeProvider } from "./withTheme";
import { WithTopLoader } from "./withTopLoader";

type TProvidersProps = {
	children: ReactNode;
};

export default function Providers({ children }: TProvidersProps) {
	return (
		<WithMsw>
			<WithStore>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{children}
					<WithTopLoader />
					<Toaster />
				</ThemeProvider>
			</WithStore>
		</WithMsw>
	);
}
