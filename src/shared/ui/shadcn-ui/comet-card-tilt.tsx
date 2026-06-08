"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { ReactNode } from "react";
import { useRef } from "react";

import { cn } from "@/shared/lib/index";

const SPRING_CONFIG = { stiffness: 320, damping: 22 };
const POINTER_SENSITIVITY = 1.55;

const clampPointer = (value: number) =>
	Math.max(-0.5, Math.min(0.5, value * POINTER_SENSITIVITY));

export interface CometCardTiltProps {
	className?: string;
	children: ReactNode;
	rotateDepth?: number;
	translateDepth?: number;
	initialRotateX?: number;
	initialRotateY?: number;
	hoverScale?: number;
}

export const CometCardTilt = ({
	className,
	children,
	rotateDepth = 7,
	translateDepth = 5,
	initialRotateX = 0,
	initialRotateY = 0,
	hoverScale = 1.02
}: CometCardTiltProps) => {
	const ref = useRef<HTMLDivElement>(null);
	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const mouseXSpring = useSpring(x, SPRING_CONFIG);
	const mouseYSpring = useSpring(y, SPRING_CONFIG);

	const rotateX = useTransform(
		mouseYSpring,
		[-0.5, 0.5],
		[
			`${-rotateDepth + initialRotateX}deg`,
			`${rotateDepth + initialRotateX}deg`
		]
	);
	const rotateY = useTransform(
		mouseXSpring,
		[-0.5, 0.5],
		[
			`${rotateDepth + initialRotateY}deg`,
			`${-rotateDepth + initialRotateY}deg`
		]
	);
	const translateX = useTransform(
		mouseXSpring,
		[-0.5, 0.5],
		[`-${translateDepth}px`, `${translateDepth}px`]
	);
	const translateY = useTransform(
		mouseYSpring,
		[-0.5, 0.5],
		[`${translateDepth}px`, `-${translateDepth}px`]
	);

	const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
		if (!ref.current) return;

		const rect = ref.current.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		x.set(clampPointer(mouseX / rect.width - 0.5));
		y.set(clampPointer(mouseY / rect.height - 0.5));
	};

	const handlePointerLeave = () => {
		x.set(0);
		y.set(0);
	};

	return (
		<div
			ref={ref}
			onPointerMove={handlePointerMove}
			onPointerLeave={handlePointerLeave}
			className={cn("perspective-distant w-full transform-3d", className)}
		>
			<motion.div
				style={{
					rotateX,
					rotateY,
					translateX,
					translateY,
					transformStyle: "preserve-3d"
				}}
				whileHover={
					hoverScale === 1
						? undefined
						: {
								scale: hoverScale,
								transition: { ease: "easeOut" }
							}
				}
				className="relative w-full"
			>
				{children}
			</motion.div>
		</div>
	);
};
