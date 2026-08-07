import { PackageOpenIcon } from "lucide-react";

export function EmptyState() {
	return (
		<div className="flex h-[260px] flex-col items-center justify-center p-8 text-center">
			<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full">
				<PackageOpenIcon className="h-10 w-10 text-muted-foreground" />
			</div>
			<h3 className="mb-1 text-lg font-semibold text-foreground">
				No results
			</h3>
			<p className="max-w-[300px] text-sm text-muted-foreground">
				Try adjusting your search or filters.
			</p>
		</div>
	);
}
