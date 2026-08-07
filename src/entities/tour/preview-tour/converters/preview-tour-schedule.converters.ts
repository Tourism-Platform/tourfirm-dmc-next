import type {
	IPreviewTourSchedule,
	TPreviewTourScheduleBackend
} from "../types";

export const mapPreviewTourScheduleToFrontend = (
	backend: TPreviewTourScheduleBackend
): IPreviewTourSchedule => ({
	occurrences: backend.occurrences ?? [],
	windowFrom: backend.window_from ?? null,
	windowUntil: backend.window_until ?? null
});
