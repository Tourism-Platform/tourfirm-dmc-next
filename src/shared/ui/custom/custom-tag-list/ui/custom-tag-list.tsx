type TTagListProps = {
	tags?: string[];
	className?: string;
};

export function TagList({ tags, className }: TTagListProps) {
	if (!tags?.length) {
		return null;
	}

	return (
		<div className={className ?? "mt-3 flex flex-wrap gap-2"}>
			{tags.map((tag) => (
				<span
					key={tag}
					className="bg-accent text-secondary-foreground rounded-full px-3 py-1 text-xs font-medium"
				>
					{tag}
				</span>
			))}
		</div>
	);
}
