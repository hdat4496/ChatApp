import { Actions } from './../constants/index';

const initState = {
    user: '',
    token: '',
    connection: null,
    useronline: [],
    newonline: '',
}

const sign = (state = initState, action) => {
    switch (action.type) {
        case Actions.SIGNUP:
            return state;
        case Actions.LOGIN:
            return { ...state, user: action.user, token: action.token };
        case Actions.LOGOUT:
            return { ...state, user: '', token: '', useronline: [], newonline: ''};
        case Actions.CONNECT:
            return { ...state, connection: action.connection };
        case Actions.DISCONNECT:
            return { ...state, connection: null };
        case Actions.SAVE_USER_ONLINE:
            return { ...state, useronline: action.useronline };
        case Actions.SAVE_NEW_ONLINE:
            return { ...state, newonline: action.user };
        default:
            return state;
    }
};

export default sign;