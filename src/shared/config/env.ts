export const ENV = {
	API_URL: process.env.NEXT_PUBLIC_API_URL ?? "",
	API_MOCKING: process.env.NEXT_PUBLIC_API_MOCKING === "true",
	SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "",
	CONTACT_ADDRESS: process.env.NEXT_PUBLIC_CONTACT_ADDRESS ?? "",
	CONTACT_PHONE: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "",
	CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? ""
} as const;
