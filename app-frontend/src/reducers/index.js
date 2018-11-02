import { combineReducers } from 'redux';
import sign from './signReducer';
import conversation from './conversationReducer';
import message from './messageReducer';
import page from './pageReducer';
import user from './userReducer';
import listuser from './listuserReducer';
import conselected from './conselectdReducer';
import statusfriend from './statusfriendReducer';

export default combineReducers({
    page, sign, conversation, message, user, listuser, conselected, statusfriend
});