import { RefreshCw } from "lucide-react";
import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";

import { Button } from "@/shared/ui";

interface IProps {
	children?: ReactNode;
	fallback?: ReactNode;
}

interface IState {
	hasError: boolean;
	error: Error | null;
}

const DefaultErrorUI = ({ error }: { error: Error | null }) => {
	return (
		<div className="flex flex-col items-center justify-center p-6 min-h-[200px] border-2 border-dashed border-destructive/50 rounded-lg bg-destructive/5 transition-colors">
			<h3 className="text-lg font-semibold text-destructive mb-2">
				Ошибка рендеринга
			</h3>
			<p className="text-sm text-muted-foreground text-center mb-4 max-w-md">
				Произошла ошибка при отрисовке этого компонента. Попробуйте
				обновить страницу или обратитесь в поддержку.
			</p>
			{error && (
				<pre className="text-[10px] bg-background p-2 rounded border mb-4 max-h-[100px] overflow-auto w-full font-mono opacity-70">
					{error.message}
					{"\n"}
					{error.stack}
				</pre>
			)}
			<Button
				variant="outline"
				size="sm"
				onClick={() => window.location.reload()}
				className="flex items-center gap-2"
			>
				<RefreshCw className="h-4 w-4" />
				Обновить
			</Button>
		</div>
	);
};

export class ErrorBoundary extends Component<IProps, IState> {
	public state: IState = {
		hasError: false,
		error: null
	};

	public static getDerivedStateFromError(error: Error): IState {
		return { hasError: true, error };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("ErrorBoundary caught an error:", error, errorInfo);
	}

	public render() {
		if (this.state.hasError) {
			return (
				this.props.fallback || (
					<DefaultErrorUI error={this.state.error} />
				)
			);
		}
		return this.props.children;
	}
}
