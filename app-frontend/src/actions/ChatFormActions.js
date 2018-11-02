import { Actions } from '../constants';

export const changeCon = (conseleted) => ({
    type: Actions.CHANGE_CONVERSATION, conseleted
});

export const logoutConselected = () => ({
    type: Actions.LOGOUT_CONSELECTED
});
