"use client";

import { type DialogProps } from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import { Check, type LucideIcon, Search } from "lucide-react";
import React from "react";

import { cn } from "@/shared/lib/utils";

import { Dialog, DialogContent, DialogTitle } from "./dialog";

function Command({
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive>) {
	return (
		<CommandPrimitive
			className={cn(
				"flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
				className
			)}
			{...props}
		/>
	);
}

type CommandDialogProps = DialogProps & { className?: string };

const CommandDialog = ({
	children,
	className,
	...props
}: CommandDialogProps) => {
	return (
		<Dialog {...props}>
			<DialogContent
				className={cn("overflow-hidden p-0 shadow-lg", className)}
			>
				<DialogTitle className="hidden" />
				<Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
					{children}
				</Command>
			</DialogContent>
		</Dialog>
	);
};

interface CommandInputProps extends React.ComponentProps<
	typeof CommandPrimitive.Input
> {
	icon?: LucideIcon;
}

function CommandInput({
	className,
	icon: Icon = Search,
	...props
}: CommandInputProps) {
	return (
		<div
			className="flex items-center px-3"
			cmdk-input-wrapper=""
			data-slot="command-input"
		>
			<Icon className="me-2 h-4 w-4 shrink-0 opacity-50 text-primary" />
			<CommandPrimitive.Input
				className={cn(
					"flex h-9 w-full rounded-md bg-transparent py-1 text-sm outline-hidden text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
					className
				)}
				{...props}
			/>
		</div>
	);
}

function CommandList({
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
	return (
		<CommandPrimitive.List
			data-slot="command-list"
			className={cn(
				"max-h-[300px] overflow-y-auto overflow-x-hidden",
				"scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border",
				"[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border/60 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-border",
				className
			)}
			{...props}
		/>
	);
}

function CommandEmpty({
	...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
	return (
		<CommandPrimitive.Empty
			data-slot="command-empty"
			className="py-6 text-center text-sm"
			{...props}
		/>
	);
}

function CommandGroup({
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
	return (
		<CommandPrimitive.Group
			data-slot="command-group"
			className={cn(
				"overflow-hidden p-1.5 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
				className
			)}
			{...props}
		/>
	);
}

function CommandSeparator({
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
	return (
		<CommandPrimitive.Separator
			data-slot="command-separator"
			className={cn("-mx-1.5 h-px bg-border", className)}
			{...props}
		/>
	);
}

function CommandItem({
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
	return (
		<CommandPrimitive.Item
			data-slot="command-item"
			className={cn(
				"relative flex text-foreground cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-hidden data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
				"[&_svg:not([role=img]):not([class*=text-])]:opacity-60",
				className
			)}
			{...props}
		/>
	);
}

const CommandShortcut = ({
	className,
	...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
	return (
		<span
			data-slot="command-shortcut"
			className={cn(
				"ms-auto text-xs tracking-widest text-muted-foreground",
				className
			)}
			{...props}
		/>
	);
};

interface CommandCheckProps extends React.SVGProps<SVGSVGElement> {
	icon?: React.ComponentType<{ className?: string }>;
}

function CommandCheck({
	icon: Icon = Check,
	className,
	...props
}: CommandCheckProps) {
	return (
		<Icon
			data-slot="command-check"
			data-check="true"
			className={cn("size-4 ms-auto text-primary", className)}
			{...props}
		/>
	);
}

export {
	Command,
	CommandCheck,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut
};
