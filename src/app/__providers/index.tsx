import type { ReactNode } from "react";

import { ThemeProvider } from "./withTheme";
import { WithTopLoader } from "./withTopLoader";

type TProvidersProps = {
	children: ReactNode;
};

export default function Providers({ children }: TProvidersProps) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			{children}
			<WithTopLoader />
		</ThemeProvider>
	);
}
