import React, { Component } from 'react';
import { Input, Icon } from 'antd';
import axios from 'axios';
import { connect } from 'react-redux';
import { saveMessage } from '../actions/MessageActions';
import { saveUserData } from '../actions/UserActions';
import { saveConversationList } from '../actions/ConversationActions';
const url = 'http://localhost:10010';
const { TextArea } = Input;
class ChatFooter extends Component {
    componentDidMount = () => {
        this.txtChat.textAreaRef.value = '';
    }

    chat = async () => {
        var self = this;
        var { sign } = self.props;
        var inputval = this.txtChat.textAreaRef.value.trim();
        if (inputval) {
            var objcon = self.props.conselected.conobj;
            var type = 'conversation';
            var id = objcon.conId;
            if (objcon.conId === -1) {
                type = 'group';
                id = objcon.groupId;

            }
            var newid = 1;
            await axios.get(url + '/message/getlastedmsg', {
                params: {
                    token: sign.token,
                    id: id,
                    type: type
                }
            }).then(function (res) {
                if (res.data.status === 200) {
                    newid += parseInt(res.data.value);
                } else {
                    console.log(res.data.message);
                }

            })
                .catch(function (error) {
                    console.log(error);
                });
            await axios.post(url + '/message/send', {
                objmessage: {
                    id: id,
                    token: sign.token,
                    type: type,
                    content: inputval
                },
            }).then(function (res) {
                if (res.data.status === 200) {
                } else {
                    console.log(res.data.message);
                }

            })
                .catch(function (error) {
                    console.log(error);
                });


            await sign.connection.send(JSON.stringify({
                type: 'SEND_MESSAGE',
                token: sign.token,
                type_group_con: type,
                id: id
            }));

            this.txtChat.textAreaRef.value = '';
        }
    }
    handleKeyPress = event => {
        if (event.key === 'Enter' && !event.shiftKey) {
            this.chat();
            event.preventDefault();
        }
    };

    render() {
        return (
            <div className='chat-footer'>
                <TextArea ref={(ref) => { this.txtChat = ref; }} onKeyPress={this.handleKeyPress} className='chat-input' size="small" placeholder="Enter message" />
                <Icon onClick={() => this.chat()} className='icon-enter' type="enter" theme="outlined" />

            </div>
        );
    }
}

const mapStateToProps = state => ({
    sign: state.sign,
    conselected: state.conselected,
    message: state.message,
    listcon:  state.conversation.listConversation,
    userdata : state.user.user
});

const mapDispatchToProps = (dispatch) => ({
    saveUserData: (user_data) => dispatch(saveUserData(user_data)),
    saveMessage: (listMessage) => dispatch(saveMessage(listMessage)),
    saveConversationList: (conlist) => dispatch(saveConversationList(conlist)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatFooter);
