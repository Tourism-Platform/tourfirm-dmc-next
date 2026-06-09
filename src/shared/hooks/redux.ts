import {
	type TypedUseSelectorHook,
	useDispatch,
	useSelector
} from "react-redux";

import type { TAppDispatch, TRootState } from "@/shared/lib/store";

export const useAppDispatch = () => useDispatch<TAppDispatch>();
export const useAppSelector: TypedUseSelectorHook<TRootState> = useSelector;
