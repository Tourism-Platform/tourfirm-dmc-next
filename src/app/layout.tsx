import type { ReactNode } from "react";

type TProps = {
	children: ReactNode;
};

export default function RootLayout({ children }: TProps) {
	return children;
}
