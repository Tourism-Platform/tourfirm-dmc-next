import {
	type TypedUseSelectorHook,
	useDispatch,
	useSelector
} from "react-redux";

import { type TAppDispatch, type TRootState } from "@/app/__providers/store";

export type { TAppDispatch, TRootState };

export const useAppDispatch = () => useDispatch<TAppDispatch>();
export const useAppSelector: TypedUseSelectorHook<TRootState> = useSelector;
