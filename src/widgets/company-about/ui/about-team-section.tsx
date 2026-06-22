import { getTranslations } from "next-intl/server";

import { CustomSectionHeader } from "@/shared/ui";

type TAboutTeamMember = {
	initials: string;
	name: string;
	title: string;
	description: string;
};

export async function AboutTeamSection() {
	const t = await getTranslations("company_about_page");
	const members = t.raw("team.members") as TAboutTeamMember[];

	return (
		<section className="flex flex-col gap-6 sm:gap-8">
			<CustomSectionHeader
				eyebrow={t("team.eyebrow")}
				title={t("team.title")}
				description={t("team.description")}
			/>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{members.map((member, index) => (
					<article
						key={index}
						className="bg-card flex flex-col gap-3 rounded-xl border p-5 sm:p-6"
					>
						<div
							className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-md text-xs font-semibold"
							aria-hidden
						>
							{member.initials}
						</div>
						<h3 className="text-base font-semibold sm:text-lg">
							{member.name}
						</h3>
						<p className="text-muted-foreground text-sm">
							{member.title}
						</p>
						<p className="text-muted-foreground text-sm sm:text-base">
							{member.description}
						</p>
					</article>
				))}
			</div>
		</section>
	);
}
