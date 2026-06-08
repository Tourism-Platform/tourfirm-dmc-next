import type { ReactNode } from "react";

import { ThemeProvider } from "./withTheme";

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
		</ThemeProvider>
	);
}
