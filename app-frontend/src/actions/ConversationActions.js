import { Actions } from '../constants';

export const createConversation = (listConversation) => ({
    type: Actions.CREATE_CONVERSATION, listConversation
});

export const saveConversationList = (listConversation) => ({
    type: Actions.SAVE_CONVERSATION_LIST, listConversation
});

export const saveStatusFriend = (status) => ({
    type: Actions.SAVE_STATUS_FRIEND, status
});

export const logoutConversation = () => ({
    type: Actions.LOGOUT_CONVERSATION
});

export const addMemberGroupConversation = () => ({
    type: Actions.ADD_MEMBER_GROUP_CONVERSATION
});
