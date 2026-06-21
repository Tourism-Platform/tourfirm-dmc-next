export const ENV = {
	API_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api",
	API_MOCKING: true,
	SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
	CONTACT_ADDRESS: process.env.NEXT_PUBLIC_CONTACT_ADDRESS ?? "",
	CONTACT_PHONE: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "",
	CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? ""
} as const;
