"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef } from "react";

import type {
	TRouteLineEndpointProps,
	TRouteLineItemProps
} from "@/shared/ui/blocks/types/block-render.types";

type TRouteLineTrackProps = {
	start?: TRouteLineEndpointProps;
	end?: TRouteLineEndpointProps;
	items: TRouteLineItemProps[];
};

/** Compact landing geometry: shorter canvas, start/end as bottom nodes. */
const mapX = (x: number) => Math.round((x - 285) * 0.82 + 175);

const PATH_LEAD = 72;

const PATH_D = [
	`M${mapX(285) - PATH_LEAD},200`,
	`C${mapX(285) - PATH_LEAD / 2},200 ${mapX(285) - 18},200 ${mapX(285)},200`,
	`C${mapX(331)},200 ${mapX(348)},168 ${mapX(391)},168`,
	`C${mapX(439)},168 ${mapX(454)},240 ${mapX(518)},240`,
	`C${mapX(581)},240 ${mapX(595)},162 ${mapX(665)},162`,
	`C${mapX(733)},162 ${mapX(743)},246 ${mapX(807)},246`,
	`C${mapX(872)},246 ${mapX(882)},172 ${mapX(940)},172`,
	// Descend from last peak, then hold a clean horizontal into the tip (like the left lead-in)
	`C${mapX(970)},172 ${mapX(988)},200 ${mapX(990) + 8},200`,
	`C${mapX(990) + 28},200 ${mapX(990) + PATH_LEAD - 20},200 ${mapX(990) + PATH_LEAD},200`
].join(" ");

const START_NODE = {
	x: mapX(285) - PATH_LEAD,
	y: 200,
	tickTo: 318
} as const;

const END_NODE = {
	x: mapX(990) + PATH_LEAD,
	y: 200,
	tickTo: 318
} as const;

const STOPS = [
	{
		x: mapX(391),
		y: 168,
		tick: {
			x1: mapX(391),
			y1: 160,
			x2: mapX(391),
			y2: 98,
			origin: "bottom" as const
		},
		label: { left: mapX(391), side: "top" as const, anchorY: 90 }
	},
	{
		x: mapX(518),
		y: 240,
		tick: {
			x1: mapX(518),
			y1: 248,
			x2: mapX(518),
			y2: 318,
			origin: "top" as const
		},
		label: { left: mapX(518), side: "bottom" as const, anchorY: 326 }
	},
	{
		x: mapX(665),
		y: 162,
		tick: {
			x1: mapX(665),
			y1: 154,
			x2: mapX(665),
			y2: 94,
			origin: "bottom" as const
		},
		label: { left: mapX(665), side: "top" as const, anchorY: 86 }
	},
	{
		x: mapX(807),
		y: 246,
		tick: {
			x1: mapX(807),
			y1: 254,
			x2: mapX(807),
			y2: 318,
			origin: "top" as const
		},
		label: { left: mapX(807), side: "bottom" as const, anchorY: 326 }
	},
	{
		x: mapX(940),
		y: 172,
		tick: {
			x1: mapX(940),
			y1: 164,
			x2: mapX(940),
			y2: 98,
			origin: "bottom" as const
		},
		label: { left: mapX(940), side: "top" as const, anchorY: 90 }
	}
] as const;

const CANVAS_WIDTH = 980;
const CANVAS_HEIGHT = 520;
const SVG_HEIGHT = 360;
const RIDE_DURATION_MS = 3400;

function formatStopLabel(index: number): string {
	return String(index + 1).padStart(2, "0");
}

function ease(u: number): number {
	const s = u * u * (3 - 2 * u);
	return 0.72 * u + 0.28 * s;
}

function clampEase(e: number, d: number): number {
	if (e <= 0) {
		return 0;
	}

	const u = Math.min(1, e / d);
	return 1 - Math.pow(1 - u, 3);
}

function pop(e: number, d: number): number {
	if (e <= 0) {
		return 0;
	}

	const u = Math.min(1, e / d);
	const c = 1.9;
	return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2);
}

function timeAtFrac(frac: number, duration: number): number {
	let lo = 0;
	let hi = 1;

	for (let i = 0; i < 40; i++) {
		const m = (lo + hi) / 2;

		if (ease(m) < frac) {
			lo = m;
		} else {
			hi = m;
		}
	}

	return ((lo + hi) / 2) * duration;
}

function lenAtX(path: SVGPathElement, length: number, x: number): number {
	let lo = 0;
	let hi = length;

	for (let i = 0; i < 40; i++) {
		const m = (lo + hi) / 2;

		if (path.getPointAtLength(m).x < x) {
			lo = m;
		} else {
			hi = m;
		}
	}

	return (lo + hi) / 2;
}

export function RouteLineTrack({ start, end, items }: TRouteLineTrackProps) {
	const rootRef = useRef<HTMLDivElement>(null);
	const glowId = useId().replace(/:/g, "");
	const stops = items.slice(0, 5);
	const reduceMotion = useReducedMotion();
	const inView = useInView(rootRef, { amount: 0.25, margin: "0px" });

	useEffect(() => {
		const root = rootRef.current;

		if (!root || !stops.length) {
			return;
		}

		const path = root.querySelector<SVGPathElement>("[data-id='route']");
		const halo = root.querySelector<SVGPathElement>("[data-id='halo']");
		const runner = root.querySelector<SVGGElement>("[data-id='runner']");
		const rGlow = root.querySelector<SVGCircleElement>(
			"[data-id='runner-glow']"
		);
		const rCore = root.querySelector<SVGCircleElement>(
			"[data-id='runner-core']"
		);
		const endDot = root.querySelector<HTMLElement>("[data-id='end-dot']");
		const endCard = root.querySelector<HTMLElement>("[data-id='end-card']");
		const endTick = root.querySelector<SVGLineElement>(
			"[data-id='tick'][data-stop='end']"
		);
		const desktop = root.querySelector<HTMLElement>("[data-id='canvas']");

		if (!path || !halo || !runner || !rGlow || !rCore || !desktop) {
			return;
		}

		const wide = window.matchMedia("(min-width: 1024px)");

		type TStopAnim = {
			dot: HTMLElement | SVGElement | null;
			tick: HTMLElement | SVGElement | null;
			label: HTMLElement | null;
			x: number;
			frac: number;
			t: number;
		};

		let length = 0;
		let duration = RIDE_DURATION_MS;
		let endT = 0;
		let raf = 0;
		let running = false;
		let startTs = 0;
		let stopAnims: TStopAnim[] = [];

		const showAll = () => {
			cancelAnimationFrame(raf);
			running = false;
			path.style.strokeDashoffset = "0";
			halo.style.strokeDashoffset = "0";
			runner.style.opacity = "0";
			if (endDot) {
				endDot.style.opacity = "1";
				endDot.style.transform = "translate(-50%, -50%) scale(1)";
			}
			if (endCard) {
				endCard.style.opacity = "1";
				endCard.style.transform = "translate(-50%, 0)";
			}
			if (endTick) {
				endTick.style.transform = "scaleY(1)";
			}
			stopAnims.forEach((s) => {
				if (s.dot) {
					(s.dot as HTMLElement).style.transform = "scale(1)";
				}
				if (s.tick) {
					(s.tick as HTMLElement).style.transform = "scaleY(1)";
				}
				if (s.label) {
					s.label.style.opacity = "1";
					s.label.style.transform =
						s.label.dataset.side === "top"
							? "translate(-50%, -100%)"
							: "translate(-50%, 0)";
				}
			});
		};

		const measure = () => {
			length = path.getTotalLength();

			if (!length) {
				return false;
			}

			path.style.strokeDasharray = String(length);
			halo.style.strokeDasharray = String(length);
			duration = RIDE_DURATION_MS;

			stopAnims = STOPS.map((stop, index) => {
				const n = index + 1;
				const frac = lenAtX(path, length, stop.x) / length;

				return {
					dot: root.querySelector(
						`[data-id='dot'][data-stop='${n}']`
					),
					tick: root.querySelector(
						`[data-id='tick'][data-stop='${n}']`
					),
					label: root.querySelector(
						`[data-id='label'][data-stop='${n}']`
					),
					x: stop.x,
					frac,
					t: timeAtFrac(frac, duration)
				};
			});

			endT = timeAtFrac(1, duration);
			return true;
		};

		const reset = () => {
			cancelAnimationFrame(raf);
			startTs = 0;
			running = false;
			path.style.strokeDashoffset = String(length);
			halo.style.strokeDashoffset = String(length);
			runner.style.opacity = "0";
			if (endDot) {
				endDot.style.opacity = "0";
				endDot.style.transform = "translate(-50%, -50%) scale(0)";
			}
			if (endCard) {
				endCard.style.opacity = "0";
				endCard.style.transform = "translate(-50%, 8px)";
			}
			if (endTick) {
				endTick.style.transform = "scaleY(0)";
			}
			stopAnims.forEach((s) => {
				if (s.dot) {
					(s.dot as HTMLElement).style.transform = "scale(0)";
				}
				if (s.tick) {
					(s.tick as HTMLElement).style.transform = "scaleY(0)";
				}
				if (s.label) {
					s.label.style.opacity = "0";
					s.label.style.transform =
						s.label.dataset.side === "top"
							? "translate(-50%, calc(-100% + 8px))"
							: "translate(-50%, 8px)";
				}
			});
		};

		const play = () => {
			if (running) {
				return;
			}

			if (!measure()) {
				showAll();
				return;
			}

			reset();
			running = true;

			const tick = (now: number) => {
				if (!startTs) {
					startTs = now;
				}

				const t = now - startTs;
				const u = Math.min(1, t / duration);
				const p = ease(u);

				path.style.strokeDashoffset = String(length * (1 - p));
				halo.style.strokeDashoffset = String(
					length * (1 - Math.max(0, p - 0.012))
				);

				const pt = path.getPointAtLength(length * p);
				rGlow.setAttribute("cx", String(pt.x));
				rGlow.setAttribute("cy", String(pt.y));
				rCore.setAttribute("cx", String(pt.x));
				rCore.setAttribute("cy", String(pt.y));

				const fadeIn = Math.min(1, t / 160);
				const fadeOut =
					u >= 1 ? Math.max(0, 1 - (t - duration) / 260) : 1;
				runner.style.opacity = String(fadeIn * fadeOut);
				rGlow.setAttribute("r", String(14 + 4 * Math.sin(t / 140)));

				stopAnims.forEach((s) => {
					const e = t - s.t;

					if (s.dot) {
						(s.dot as HTMLElement).style.transform =
							`scale(${pop(e, 300)})`;
					}
					if (s.tick) {
						(s.tick as HTMLElement).style.transform =
							`scaleY(${clampEase(e - 110, 200)})`;
					}
					if (s.label) {
						const lp = clampEase(e - 240, 320);
						const isTop = s.label.dataset.side === "top";
						s.label.style.opacity = String(lp);
						s.label.style.transform = isTop
							? `translate(-50%, calc(-100% + ${8 - 8 * lp}px))`
							: `translate(-50%, ${8 - 8 * lp}px)`;
					}
				});

				const eEnd = t - endT;
				if (endDot) {
					endDot.style.opacity = eEnd > 0 ? "1" : "0";
					endDot.style.transform = `translate(-50%, -50%) scale(${pop(eEnd, 420)})`;
				}
				if (endTick) {
					endTick.style.transform = `scaleY(${clampEase(eEnd - 80, 220)})`;
				}
				if (endCard) {
					const cp = clampEase(eEnd - 180, 340);
					endCard.style.opacity = String(cp);
					endCard.style.transform = `translate(-50%, ${8 - 8 * cp}px)`;
				}

				if (t < duration + 800) {
					raf = requestAnimationFrame(tick);
				} else {
					running = false;
				}
			};

			raf = requestAnimationFrame(tick);
		};

		if (!measure()) {
			return;
		}

		// Mobile / reduced motion: static final state (landing calm path)
		if (!wide.matches || reduceMotion) {
			showAll();
			return;
		}

		// Landing sample: play on enter, reset on leave (replayOnReenter)
		if (inView) {
			play();
		} else {
			reset();
		}

		const onWideChange = () => {
			cancelAnimationFrame(raf);
			running = false;
			if (!wide.matches || reduceMotion) {
				if (measure()) {
					showAll();
				}
				return;
			}
			if (inView) {
				play();
			} else {
				reset();
			}
		};

		wide.addEventListener("change", onWideChange);

		return () => {
			wide.removeEventListener("change", onWideChange);
			cancelAnimationFrame(raf);
		};
	}, [stops.length, inView, reduceMotion]);

	return (
		<div ref={rootRef} className="tourlink-route-line mt-8 sm:mt-10">
			<div className="flex flex-col lg:hidden">
				{(start?.label || start?.title || start?.description) && (
					<div className="relative border-l-2 border-foreground pb-7 pl-7">
						<span
							aria-hidden
							className="absolute top-0.5 -left-[9px] size-4 rounded-md bg-foreground"
						/>
						{start.label ? (
							<p className="font-mono text-[9.5px] tracking-[0.16em] text-primary uppercase">
								{start.label}
							</p>
						) : null}
						{start.title ? (
							<p className="mt-1 text-base font-semibold tracking-tight">
								{start.title}
							</p>
						) : null}
						{start.description ? (
							<p className="mt-1 text-sm leading-relaxed text-muted-foreground">
								{start.description}
							</p>
						) : null}
					</div>
				)}

				{stops.map((item, index) => (
					<article
						key={item.key ?? String(index)}
						className="relative border-l-2 border-primary/20 pb-7 pl-7"
					>
						<span
							aria-hidden
							className="absolute top-1.5 -left-1.5 size-2.5 rounded-full border-2 border-primary bg-background"
						/>
						<p className="mb-1 font-mono text-[11px] tracking-[0.14em] text-primary">
							{formatStopLabel(index)}
						</p>
						<p className="text-[17px] font-semibold tracking-tight">
							{item.title}
						</p>
						{item.description ? (
							<p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
								{item.description}
							</p>
						) : null}
					</article>
				))}

				{(end?.label || end?.title || end?.description) && (
					<div className="relative pb-0 pl-7">
						<span
							aria-hidden
							className="absolute top-0.5 -left-[9px] size-4 rounded-full bg-primary shadow-[0_0_0_5px_color-mix(in_oklab,var(--primary)_20%,transparent)]"
						/>
						{end.label ? (
							<p className="font-mono text-[9.5px] tracking-[0.16em] text-primary uppercase">
								{end.label}
							</p>
						) : null}
						{end.title ? (
							<p className="mt-1 text-lg font-semibold tracking-tight text-primary">
								{end.title}
							</p>
						) : null}
						{end.description ? (
							<p className="mt-1 text-sm leading-relaxed text-muted-foreground">
								{end.description}
							</p>
						) : null}
					</div>
				)}
			</div>

			<div className="hidden w-full lg:block">
				<div
					data-id="canvas"
					className="relative mx-auto w-full max-w-[980px]"
					style={{
						height: CANVAS_HEIGHT,
						aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}`
					}}
				>
					<svg
						viewBox={`0 0 ${CANVAS_WIDTH} ${SVG_HEIGHT}`}
						className="absolute top-0 left-0 h-auto w-full overflow-visible"
						aria-hidden
					>
						<defs>
							<filter
								id={glowId}
								x="-200%"
								y="-200%"
								width="500%"
								height="500%"
							>
								<feGaussianBlur stdDeviation="9" />
							</filter>
						</defs>

						<path
							data-id="halo"
							d={PATH_D}
							fill="none"
							stroke="var(--primary)"
							strokeWidth="9"
							strokeLinecap="round"
							opacity="0.14"
							style={{
								strokeDasharray: 9999,
								strokeDashoffset: 9999
							}}
						/>
						<path
							data-id="route"
							d={PATH_D}
							fill="none"
							stroke="var(--primary)"
							strokeWidth="2.5"
							strokeLinecap="round"
							style={{
								strokeDasharray: 9999,
								strokeDashoffset: 9999
							}}
						/>

						{/* start node: always visible */}
						<line
							x1={START_NODE.x}
							y1={START_NODE.y + 8}
							x2={START_NODE.x}
							y2={START_NODE.tickTo}
							stroke="var(--primary)"
							strokeWidth="1.5"
							opacity="0.45"
						/>
						<circle
							cx={START_NODE.x}
							cy={START_NODE.y}
							r="7"
							fill="var(--background)"
							stroke="var(--primary)"
							strokeWidth="2.5"
						/>

						{STOPS.map((stop, index) => (
							<line
								key={`tick-${index}`}
								data-id="tick"
								data-stop={index + 1}
								x1={stop.tick.x1}
								y1={stop.tick.y1}
								x2={stop.tick.x2}
								y2={stop.tick.y2}
								stroke="var(--primary)"
								strokeWidth="1.5"
								style={{
									transformBox: "fill-box",
									transformOrigin:
										stop.tick.origin === "bottom"
											? "50% 100%"
											: "50% 0%",
									transform: "scaleY(0)"
								}}
							/>
						))}

						{STOPS.map((stop, index) => (
							<circle
								key={`dot-${index}`}
								data-id="dot"
								data-stop={index + 1}
								cx={stop.x}
								cy={stop.y}
								r="7"
								fill="var(--background)"
								stroke="var(--primary)"
								strokeWidth="2.5"
								style={{
									transformBox: "fill-box",
									transformOrigin: "center",
									transform: "scale(0)"
								}}
							/>
						))}

						{/* end tick down to card */}
						<line
							data-id="tick"
							data-stop="end"
							x1={END_NODE.x}
							y1={END_NODE.y + 12}
							x2={END_NODE.x}
							y2={END_NODE.tickTo}
							stroke="var(--primary)"
							strokeWidth="1.5"
							style={{
								transformBox: "fill-box",
								transformOrigin: "50% 0%",
								transform: "scaleY(0)"
							}}
						/>

						<g data-id="runner" style={{ opacity: 0 }}>
							<circle
								data-id="runner-glow"
								cx={START_NODE.x}
								cy={START_NODE.y}
								r="16"
								fill="var(--primary)"
								opacity="0.45"
								filter={`url(#${glowId})`}
							/>
							<circle
								data-id="runner-core"
								cx={START_NODE.x}
								cy={START_NODE.y}
								r="5.5"
								fill="var(--primary)"
							/>
						</g>
					</svg>

					{stops.map((item, index) => {
						const stop = STOPS[index];
						const isTop = stop.label.side === "top";

						return (
							<div
								key={item.key ?? String(index)}
								data-id="label"
								data-stop={index + 1}
								data-side={stop.label.side}
								className="pointer-events-none absolute w-[10.5rem] text-center"
								style={{
									left: `${(stop.label.left / CANVAS_WIDTH) * 100}%`,
									top: `${(stop.label.anchorY / CANVAS_HEIGHT) * 100}%`,
									transform: isTop
										? "translate(-50%, calc(-100% + 8px))"
										: "translate(-50%, 8px)",
									opacity: 0
								}}
							>
								<p className="mb-1 font-mono text-[11px] tracking-[0.14em] text-primary">
									{formatStopLabel(index)}
								</p>
								<p className="text-[17px] leading-snug font-semibold tracking-tight text-pretty">
									{item.title}
								</p>
								{item.description ? (
									<p className="mt-1 text-[13px] leading-snug text-muted-foreground text-pretty">
										{item.description}
									</p>
								) : null}
							</div>
						);
					})}

					{(start?.label || start?.title) && (
						<div
							className="absolute w-max max-w-[11rem] -translate-x-1/2"
							style={{
								left: `${(START_NODE.x / CANVAS_WIDTH) * 100}%`,
								top: `${(326 / CANVAS_HEIGHT) * 100}%`
							}}
						>
							<div className="relative rounded-[5px] border border-border/60 bg-background px-[18px] py-3.5 shadow-[0_12px_26px_-20px_rgba(14,34,49,0.5)]">
								<span
									aria-hidden
									className="absolute top-0 left-0 h-0.5 w-[34px] rounded-tl-[5px] bg-foreground"
								/>
								{start.label ? (
									<p className="font-mono text-[9.5px] tracking-[0.16em] text-muted-foreground uppercase">
										{start.label}
									</p>
								) : null}
								{start.title ? (
									<p className="mt-1 text-base leading-snug font-semibold tracking-tight text-pretty">
										{start.title}
									</p>
								) : null}
							</div>
						</div>
					)}

					{(end?.label || end?.title) && (
						<>
							<div
								data-id="end-dot"
								className="absolute flex size-10 items-center justify-center rounded-full bg-primary shadow-[0_0_0_8px_color-mix(in_oklab,var(--primary)_16%,transparent)]"
								style={{
									left: `${(END_NODE.x / CANVAS_WIDTH) * 100}%`,
									top: `${(END_NODE.y / CANVAS_HEIGHT) * 100}%`,
									opacity: 0,
									transform: "translate(-50%, -50%) scale(0)"
								}}
							>
								<div className="size-2.5 rounded-full bg-background" />
							</div>
							<div
								data-id="end-card"
								className="absolute w-max max-w-[11rem] text-left"
								style={{
									left: `${(END_NODE.x / CANVAS_WIDTH) * 100}%`,
									top: `${(326 / CANVAS_HEIGHT) * 100}%`,
									opacity: 0,
									transform: "translate(-50%, 8px)"
								}}
							>
								<div className="relative rounded-[5px] border border-primary/20 bg-primary/10 px-[18px] py-3.5 shadow-[0_14px_30px_-20px_color-mix(in_oklab,var(--primary)_55%,transparent)]">
									<span
										aria-hidden
										className="absolute top-0 right-0 h-0.5 w-[34px] rounded-tr-[5px] bg-primary"
									/>
									{end.label ? (
										<p className="font-mono text-[9.5px] tracking-[0.16em] text-muted-foreground uppercase">
											{end.label}
										</p>
									) : null}
									{end.title ? (
										<p className="mt-1 text-lg leading-snug font-semibold tracking-tight text-primary text-pretty">
											{end.title}
										</p>
									) : null}
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
