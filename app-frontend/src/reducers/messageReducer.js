import { Actions } from '../constants';
const initState = {
    listMessage: []
}
const message = (state = initState, action) => {
    switch (action.type) {
        case Actions.SAVE_MESSAGE:
            return { ...state, listMessage: action.listMessage };
        case Actions.LOGOUT_MESSAGE:
            return initState;
        default:
            return state;
    }
};

export default message;