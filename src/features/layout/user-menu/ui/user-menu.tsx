"use client";

import { Login3Icon } from "@solar-icons/react/outline";
import { Loader, LogOutIcon } from "lucide-react";
import type { FC } from "react";

import { ENUM_PATH } from "@/shared/config";
import { useAppSelector } from "@/shared/hooks";
import { Link } from "@/shared/i18n";
import { resolveLucideIcon } from "@/shared/lib/icons/resolve-lucide-icon";
import type { TResolvedUserMenuItem } from "@/shared/types/navigation.types";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Skeleton
} from "@/shared/ui";
import { useUiContent } from "@/shared/ui-content";

import { useGetAuthAccountQuery } from "@/entities/auth";
import { useGetAccountQuery } from "@/entities/user";

import { useSignOutAction } from "@/features/auth";

type TProps = {
	items: TResolvedUserMenuItem[];
};

function getDisplayName(
	firstName: string | undefined,
	lastName: string | undefined,
	email: string | undefined,
	fallback: string
): string {
	const fullName = [firstName, lastName]
		.map((part) => part?.trim())
		.filter(Boolean)
		.join(" ");

	return fullName || email?.trim() || fallback;
}

function getInitials(
	firstName: string,
	lastName: string,
	email: string
): string {
	const first = firstName.trim().charAt(0);
	const last = lastName.trim().charAt(0);

	if (first && last) {
		return `${first}${last}`.toUpperCase();
	}

	if (first || last) {
		return (first || last).toUpperCase();
	}

	return email.trim().charAt(0).toUpperCase();
}

export const UserMenu: FC<TProps> = ({ items }) => {
	const { header } = useUiContent();
	const { userMenu } = header;
	const isAuth = useAppSelector((state) => state.userSlice.isAuth);
	const { handleSignOut, isLoading: isSigningOut } = useSignOutAction();
	const { data: authAccount, isLoading: isAuthLoading } =
		useGetAuthAccountQuery(undefined, { skip: !isAuth });
	const { data: accountData, isLoading: isAccountLoading } =
		useGetAccountQuery(undefined, { skip: !isAuth });

	if (!isAuth) {
		return (
			<Button
				variant="default"
				size="icon"
				className="size-9 md:min-w-28 md:px-5 md:w-auto"
				asChild
			>
				<Link href={ENUM_PATH.AUTH.LOGIN} aria-label={userMenu.login}>
					<Login3Icon className="size-5 md:hidden" />
					<span className="hidden md:inline">{userMenu.login}</span>
				</Link>
			</Button>
		);
	}

	const displayName = getDisplayName(
		accountData?.firstName,
		accountData?.lastName,
		authAccount?.email,
		userMenu.defaultUserName
	);
	const avatarSrc = accountData?.avatar ?? authAccount?.picture ?? undefined;
	const initials =
		getInitials(
			accountData?.firstName ?? "",
			accountData?.lastName ?? "",
			authAccount?.email ?? ""
		) || userMenu.defaultUserName.charAt(0);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="h-auto p-0 hover:bg-transparent"
					aria-label={displayName}
				>
					<Avatar className="size-9 cursor-pointer">
						<AvatarImage src={avatarSrc} alt={displayName} />
						<AvatarFallback>
							{isAccountLoading || isAuthLoading ? (
								<Skeleton className="size-4" />
							) : (
								initials
							)}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="max-w-64" align="end">
				<DropdownMenuLabel className="flex min-w-0 flex-col gap-1">
					<span className="text-foreground truncate text-sm font-medium">
						{isAccountLoading || isAuthLoading ? (
							<Skeleton className="h-4 w-24" />
						) : (
							displayName
						)}
					</span>
					<span className="text-muted-foreground truncate text-xs font-normal">
						{isAuthLoading ? (
							<Skeleton className="h-3 w-32" />
						) : (
							authAccount?.email
						)}
					</span>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{items.map((item) => {
					const Icon = resolveLucideIcon(item.icon);

					return (
						<DropdownMenuItem key={item.key} asChild>
							<Link
								href={item.href}
								className="text-muted-foreground hover:text-foreground"
							>
								{Icon ? (
									<Icon className="size-4 opacity-60" />
								) : null}
								<span>{item.title}</span>
							</Link>
						</DropdownMenuItem>
					);
				})}
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleSignOut}>
					{isSigningOut ? (
						<Loader className="size-4 animate-spin text-muted-foreground" />
					) : (
						<LogOutIcon
							className="size-4 opacity-60"
							aria-hidden="true"
						/>
					)}
					<span>{userMenu.logout}</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
