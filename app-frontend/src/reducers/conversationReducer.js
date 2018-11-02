import { Actions } from '../constants';

const initial = {
    listConversation: [],
}

const conversation = (state = initial, action) => {
    switch (action.type) {
        case Actions.CREATE_CONVERSATION:
            return { ...state, listConversation: action.listConversation };
        case Actions.SAVE_CONVERSATION_LIST:
            return { ...state, listConversation: action.listConversation };
        case Actions.SAVE_MESSAGE_LISTCON:
            return { ...state, listConversation: action.listConversation };
        case Actions.LOGOUT_CONVERSATION:
            return initial;
        default:
            return state;
    }
};

export default conversation;