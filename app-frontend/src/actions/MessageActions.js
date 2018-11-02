import { Actions } from '../constants';

export const chatMessage = (info) => ({
    type: Actions.CHAT_MESSAGE, info
});

export const saveMessage = (listMessage) => ({
    type: Actions.SAVE_MESSAGE, listMessage
});

export const logoutMessage = () => ({
    type: Actions.LOGOUT_MESSAGE
});