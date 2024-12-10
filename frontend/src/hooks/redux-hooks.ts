import {BunkoDispatch, RootState} from "../store.ts";
import {useDispatch, useSelector} from "react-redux";

export const useBunkoDispatch = useDispatch.withTypes<BunkoDispatch>();
export const useBunkoSelector = useSelector.withTypes<RootState>();