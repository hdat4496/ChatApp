import { Actions } from '../constants';

const initState = { conobj: '' };

const conseleted = (state = initState, action) => {
    switch (action.type) {
        case Actions.CHANGE_CONVERSATION:
            return {
                conobj: action.conseleted,
            };
        case Actions.LOGOUT_CONSELECTED:
            return initState;
        case Actions.ADD_MEMBER:
            var obj = { ...state };
            obj['conobj']['username'] = action.member;
            return obj;
        default:
            return state;
    }
};

export default conseleted;