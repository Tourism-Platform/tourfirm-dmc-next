import { type FC } from "react";

import { Input, Label } from "@/shared/ui";

interface ICustomInputProps extends React.ComponentProps<typeof Input> {
	label: string;
}

export const CustomInput: FC<ICustomInputProps> = ({ label, ...props }) => {
	return (
		<div className="grid w-full max-w-sm items-center gap-3">
			<Label htmlFor={label}>{label}</Label>
			<Input id={label} {...props} />
		</div>
	);
};
