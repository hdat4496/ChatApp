import React, { Component } from 'react';
import { Badge, Avatar } from 'antd';
import axios from 'axios';
import { connect } from 'react-redux';
import { changeCon } from '../actions/ChatFormActions';
import { saveMessage } from '../actions/MessageActions';
import {saveStatusFriend} from '../actions/ConversationActions'
import { saveUserData } from '../actions/UserActions';
import { saveConversationList } from '../actions/ConversationActions';

const url = 'http://localhost:10010';

class UserItem extends Component {
    showChatForm = async () => {
        var self = this;
        var objcon = this.props.conobj;
        var type = this.props.conobj.groupId === -1 ? 'conversation' : 'group';
        var id = this.props.conobj.groupId === -1 ? this.props.conobj.conId : this.props.conobj.groupId;
        axios.get(url + '/message/updateunread', {
            params: {
                token: self.props.sign.token,
                id: id,
                type: type
            }
        }).then(function (res) {
            if (res.data.status === 200) {
                var userData = self.props.userdata;
                if (objcon.conId !== -1) {
                    userData.listConGroup.map((e) => {
                        if (e.conId === objcon.conId) {
                            e.unread = 0;
                        }
                    });
                } else {
                    {
                        userData.listConGroup.map((e) => {
                            if (e.groupId === objcon.groupId) {
                                e.unread = 0;
                            }
                        });
                    }
                }
                self.props.saveUserData(userData);
                self.props.saveConversationList(userData.listConGroup);
            } else {
                console.log(res.data.message);
            }
        })
            .catch(function (error) {
                console.log(error);
            });

        this.props.changeCon(this.props.conobj);
        axios.get(url + '/message/getlist', {
            params: {
                token: this.props.sign.token,
                id: id,
                type: type
            }
        }).then(function (res) {
            if (res.data.status === 200) {

                res.data.listmessage.sort((a, b) => parseInt(a.id) - parseInt(b.id));
                self.props.saveMessage(res.data.listmessage);
            } else {
                console.log(res.data.message);
            }
        })
            .catch(function (error) {
                console.log(error);
            });

        if (type === 'conversation') {
            await axios.get(url + '/user/getstatus', {
                params: {
                    token: this.props.sign.token,
                    username: this.props.conobj.username,
                }
            }).then(function (res) {
                if (res.data.status === 200) {
                    self.props.saveStatusFriend(res.data.value);
                } else {
                    console.log(res.data.message);
                }

            })
                .catch(function (error) {
                    console.log(error);
                });
        }



    }

    render() {
        const { sign } = this.props;
        const useronline = sign.useronline;
        if (this.props.conobj.groupId !== -1) {
            if (!this.props.conobj.lastedmsg) {
                return (
                    <div className='user-item' onClick={() => this.showChatForm()}>
                        <div className='avatar'>

                            <Avatar size={45} icon="team" />

                        </div>
                        <div className='user-item-name'>
                            <span>{this.props.conobj.groupname}</span>
                            <br />
                            <span className='lastmsg'></span>
                        </div>
                        <div className='count-new-msg'>
                            <Badge count='0' />
                        </div>
                    </div>
                );
            }
            else {
                return (
                    <div className='user-item' onClick={() => this.showChatForm()}>
                        <div className='avatar'>
                            <Avatar size={45} icon="team" />
                        </div>
                        <div className='user-item-name'>
                            <span>{this.props.conobj.groupname}</span>
                            <br />
                            <span className='lastmsg'>{this.props.conobj.lastedmsg.content}</span>
                        </div>
                        <div className='count-new-msg'>
                            <Badge count={this.props.conobj.unread} />
                        </div>
                    </div>
                );
            }
        }
        else {
            if (!this.props.conobj.lastedmsg) {
                return (
                    <div className='user-item' onClick={() => this.showChatForm()}>
                        <div className='avatar'>
                            <Badge dot={true} status="success" className='dot-online'>
                                <Avatar size={45} icon="team" />
                            </Badge>
                        </div>
                        <div className='user-item-name'>
                            <span>{this.props.conobj.groupname}</span>
                            <br />
                            <span className='lastmsg'></span>
                        </div>

                        <div className='count-new-msg'>
                            <Badge count='0' />
                        </div>
                    </div>
                );
            }
            else {

                if (useronline.includes(this.props.conobj.username)) {
                    return (
                        <div className='user-item' onClick={() => this.showChatForm()}>
                            <div className='avatar'>
                                <Badge dot={true} status="success" className='dot-online'>
                                    <Avatar size={45} icon="user" />
                                </Badge>
                            </div>
                            <div className='user-item-name'>
                                <span>{this.props.conobj.username}</span>
                                <br />
                                <span className='lastmsg'>{this.props.conobj.lastedmsg.content}</span>
                            </div>

                            <div className='count-new-msg'>
                                <Badge count={this.props.conobj.unread} />
                            </div>
                        </div>
                    );
                }
                else {
                    return (
                        <div className='user-item' onClick={() => this.showChatForm()}>
                            <div className='avatar'>
                                <Badge dot={true} status="default" className='dot-online'>
                                    <Avatar size={45} icon="user" />
                                </Badge>
                            </div>
                            <div className='user-item-name'>
                                <span>{this.props.conobj.username}</span>
                                <br />
                                <span className='lastmsg'>{this.props.conobj.lastedmsg.content}</span>
                            </div>

                            <div className='count-new-msg'>
                                <Badge count={this.props.conobj.unread} />
                            </div>
                        </div>
                    );
                }


            }
        }

    }
}


const mapStateToProps = state => ({
    sign: state.sign,
    conselected: state.conselected,
    message : state.message,
    statusFriend: state.statusfriend,
    listcon:  state.conversation.listConversation,
    userdata : state.user.user
});

const mapDispatchToProps = (dispatch) => ({
    changeCon: (conseleted) => dispatch(changeCon(conseleted)),
    saveMessage: (listMessage) => dispatch(saveMessage(listMessage)),
    saveStatusFriend: (status) => dispatch(saveStatusFriend(status)),
    saveUserData: (user_data) => dispatch(saveUserData(user_data)),
    saveConversationList: (conlist) => dispatch(saveConversationList(conlist)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserItem);
