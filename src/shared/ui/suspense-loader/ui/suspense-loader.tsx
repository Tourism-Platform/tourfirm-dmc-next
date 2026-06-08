import type { FC } from "react";

import styles from "./suspense-loader.module.css";

export const SuspenseLoader: FC = () => {
	return (
		<div className={styles.wrapper}>
			<div className={styles.loader}></div>
			<div className="text-primary text-4xl">
				<span className="text-primary">Tour</span>
				<span className="text-foreground">Link</span>
			</div>
		</div>
	);
};
