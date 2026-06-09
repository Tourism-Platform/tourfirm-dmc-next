export const ENV = {
	API_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api",
	API_MOCKING: process.env.NEXT_PUBLIC_API_MOCKING === "true"
} as const;
