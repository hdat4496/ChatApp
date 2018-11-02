import { Actions } from '../constants';

const statusfriend = (state = '', action) => {
    switch (action.type) {
        case Actions.SAVE_STATUS_FRIEND:
            return action.status;
        case Actions.LOGOUT_STATUS_FRIEND:
            return '';
        default:
            return state;
    }
};

export default statusfriend;