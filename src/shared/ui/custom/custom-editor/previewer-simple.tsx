"use client";

import { type CSSProperties, type FC, useMemo } from "react";

import { cn } from "@/shared/lib/utils";

import { tiptapToPlainText } from "./model/tiptap-to-plain-text";

type TPreviewerSimpleProps = {
	text?: string | null;
	lines?: number;
	className?: string;
};

const lineClampStyle = (lines: number): CSSProperties => ({
	display: "-webkit-box",
	WebkitLineClamp: lines,
	WebkitBoxOrient: "vertical",
	overflow: "hidden"
});

export const PreviewerSimple: FC<TPreviewerSimpleProps> = ({
	text,
	lines = 3,
	className
}) => {
	const plainText = useMemo(() => tiptapToPlainText(text), [text]);

	if (!plainText) return null;

	return (
		<p className={cn(className)} style={lineClampStyle(lines)}>
			{plainText}
		</p>
	);
};
