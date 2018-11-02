import { Actions } from '../constants';

export const saveAllUser = (listuser) => ({
    type: Actions.SAVE_ALL_USER, listuser
});

export const logoutListUser = () => ({
    type: Actions.LOGOUT_LIST_USER
});

