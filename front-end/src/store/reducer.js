import { SET_RELOAD } from "./constants";

const initState = {
    reload: 0
}
const reducer = (state, action) => {
    switch (action.type) {
        case SET_RELOAD:
            return {...state, reload: action.payload}
        default:
            throw new Error('Error');
    }

}
export { initState };
export default reducer;