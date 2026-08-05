"use client";

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

function getInitials(firstName: string, lastName: string): string {
	const first = firstName.trim().charAt(0);
	const last = lastName.trim().charAt(0);

	if (first && last) {
		return `${first}${last}`.toUpperCase();
	}

	return first || last || "";
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
			<Button variant="outline" size="sm" asChild>
				<Link href={ENUM_PATH.AUTH.LOGIN}>{userMenu.login}</Link>
			</Button>
		);
	}

	const displayName =
		accountData?.firstName && accountData?.lastName
			? `${accountData.firstName} ${accountData.lastName}`
			: userMenu.defaultUserName;
	const avatarSrc = accountData?.avatar ?? authAccount?.picture ?? undefined;

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
							{isAccountLoading ? (
								<Skeleton className="size-4" />
							) : (
								getInitials(
									accountData?.firstName ?? "",
									accountData?.lastName ?? ""
								) || userMenu.defaultUserName.charAt(0)
							)}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="max-w-64" align="end">
				<DropdownMenuLabel className="flex min-w-0 flex-col gap-1">
					<span className="text-foreground truncate text-sm font-medium">
						{isAccountLoading ? (
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
