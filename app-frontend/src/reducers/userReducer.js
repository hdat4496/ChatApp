import { Actions } from './../constants/index';

const initState = {
    user: '',
    listuser: []
}
const user = (state = initState, action) => {
    switch (action.type) {
        case Actions.LOGOUT_USER_DATA:
            return initState;
        case Actions.SAVE_USER_DATA:
            return { ...state, user: action.user_data };
        case Actions.SAVE_LIST_USER:
            return { ...state, listuser: action.listuser };
        case Actions.SAVE_STATUS:
            var ls = { ...state };
            ls['user']['userStatus'] = action.status;
            return ls;
        case Actions.ADD_MEMBER_GROUP_USER:
            var ls = { ...state };
            ls['user']['listConGroup'][action.id]['username'] = action.member;
            return ls;
        default:
            return state;
    }
};

export default user;