export type TTheme = "light" | "dark";

export interface IThemeContextType {
	theme: TTheme;
	toggleTheme: () => void;
}
