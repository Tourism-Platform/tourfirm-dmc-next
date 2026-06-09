export async function register() {
	if (process.env.NEXT_PUBLIC_API_MOCKING !== "true") return;

	if (process.env.NEXT_RUNTIME === "nodejs") {
		const { server } = await import("./app/init/msw-server");
		server.listen({ onUnhandledRequest: "bypass" });
	}
}
