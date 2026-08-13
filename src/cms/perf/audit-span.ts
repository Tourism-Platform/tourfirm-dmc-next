import { AsyncLocalStorage } from "node:async_hooks";
import fs from "node:fs";
import path from "node:path";
import "server-only";

/**
 * Temporary forensic spans. Active only when AUDIT_PERF=1.
 * No-op in production. Remove after the cold-path audit.
 */
const ENABLED = process.env.AUDIT_PERF === "1";
const LOG_PATH = path.join(process.cwd(), "audit", "perf-spans.jsonl");

type TAuditStore = {
	phase?: string;
	url?: string;
	requestId?: string;
};

export const auditStore = new AsyncLocalStorage<TAuditStore>();

function round(n: number): number {
	return Math.round(n * 10) / 10;
}

function writeRecord(record: Record<string, unknown>): void {
	if (!ENABLED) {
		return;
	}
	try {
		const ctx = auditStore.getStore();
		fs.appendFileSync(
			LOG_PATH,
			`${JSON.stringify({
				ts: Date.now(),
				phase: ctx?.phase,
				url: ctx?.url,
				requestId: ctx?.requestId,
				...record
			})}\n`
		);
	} catch {
		// ignore audit I/O
	}
}

export function withAuditContext<T>(
	ctx: TAuditStore,
	fn: () => T | Promise<T>
): T | Promise<T> {
	if (!ENABLED) {
		return fn();
	}
	return auditStore.run({ ...auditStore.getStore(), ...ctx }, fn);
}

export async function auditSpan<T>(
	name: string,
	extra: Record<string, unknown> | undefined,
	fn: () => T | Promise<T>
): Promise<T> {
	if (!ENABLED) {
		return fn();
	}
	const t0 = performance.now();
	try {
		const result = await fn();
		writeRecord({
			name,
			ok: true,
			durationMs: round(performance.now() - t0),
			...extra
		});
		return result;
	} catch (error) {
		writeRecord({
			name,
			ok: false,
			durationMs: round(performance.now() - t0),
			...extra
		});
		throw error;
	}
}

export function auditMark(name: string, extra?: Record<string, unknown>): void {
	writeRecord({ name, ...extra });
}
