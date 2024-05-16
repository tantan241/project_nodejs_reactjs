import {SET_RELOAD} from "./constants"
export const setReload = (payload) => {
    return {
        type: SET_RELOAD,
        payload,
    };
};