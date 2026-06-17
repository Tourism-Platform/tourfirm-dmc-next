import { Button, type TButtonVariantsProps } from "../../shadcn-ui/button";

type TMailtoButtonProps = {
	email: string;
	title: string;
	variant?: TButtonVariantsProps["variant"];
};

export function MailtoButton({
	email,
	title,
	variant = "default"
}: TMailtoButtonProps) {
	return (
		<Button asChild variant={variant}>
			<a href={`mailto:${email}`}>{title}</a>
		</Button>
	);
}
