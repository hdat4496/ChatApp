import { Actions } from '../constants';

export const login = (user, token) => ({
    type: Actions.LOGIN, user, token
});

export const logOut = () => ({
    type: Actions.LOGOUT
});

export const signUp = () => ({
    type: Actions.SIGNUP
});

export const connectSocket = (connection) => ({
    type: Actions.CONNECT,
    connection
});

export const disconnectSocket = () => ({
    type: Actions.DISCONNECT
});

export const saveUserOnline = (useronline) => ({
    type: Actions.SAVE_USER_ONLINE, useronline
});

export const saveNewOnline = (user) => ({
    type: Actions.SAVE_NEW_ONLINE, user
});