import { Actions } from '../constants';

export const saveUserData = (user_data) => ({
    type: Actions.SAVE_USER_DATA, user_data
});


export const saveListUser = (listuser) => ({
    type: Actions.SAVE_LIST_USER , listuser
});

export const saveStatus = (status) => ({
    type: Actions.SAVE_STATUS , status
});

export const logoutUserData = () => ({
    type: Actions.LOGOUT_USER_DATA
});

export const logoutStatusFriend = () => ({
    type: Actions.LOGOUT_STATUS_FRIEND
});

export const addMemberGroupUser = (id, member) => ({
    type: Actions.ADD_MEMBER_GROUP_USER, id, member
});

