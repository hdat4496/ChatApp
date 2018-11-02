import { Actions } from './../constants/index';


const listuser = (state = [], action) => {
    switch (action.type) {
        case Actions.SAVE_ALL_USER:
            return { ...state, listuser: action.listuser };
        case Actions.LOGOUT_LIST_USER:
            return [];
        default:
            return state;
    }
};

export default listuser;