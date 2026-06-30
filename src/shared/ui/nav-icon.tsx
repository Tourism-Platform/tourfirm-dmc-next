"use client";

import { type FC, createElement } from "react";

import { getLucideIcon } from "@/shared/lib/get-lucide-icon";

type TNavIconProps = {
	name?: string | null;
	className?: string;
};

export const NavIcon: FC<TNavIconProps> = ({ name, className }) =>
	createElement(getLucideIcon(name), { className });
