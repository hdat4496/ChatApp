import React, { Component } from 'react';
import { Avatar, Tooltip } from 'antd';
import dateFormat from 'dateformat';
import { connect } from 'react-redux';
var lastedchat = '';
class ChatItem extends Component {
    lastedchat = '';
    render() {
        var time = new Date();
        time.setTime(this.props.contentchat.time);
        time = dateFormat(time, "d/m H:MM").toLocaleString('vi-VN', { timeZone: 'Asia/Bangkok' });
        if(this.props.contentchat.id===1){
            lastedchat = ''
        }
        if (this.props.contentchat.username === this.props.sign.user) {
            if (this.props.contentchat.username === lastedchat) {
                return (
                    //My chat
                    <div className='my-chat-item'>
                        <Tooltip placement="right" title={time}>
                            <div className='my-chat-info'>
                                <div className='my-chat-content'>{this.props.contentchat.content}</div>
                            </div>
                        </Tooltip>
                        <div style={{ width: '45px' }} className='avatar'>
                        </div>
                    </div>
                );
            } else {
                lastedchat = this.props.contentchat.username;
                return (
                    //My chat
                    <div className='my-chat-item'>
                        <Tooltip placement="right" title={time}>
                            <div className='my-chat-info'>
                                <div className='my-chat-content'>{this.props.contentchat.content}</div>
                            </div>
                        </Tooltip>
                        <div className='avatar'>
                            <Avatar size={45} icon="user" />
                        </div>
                    </div>
                );
            }

        }
        else {
            if (this.props.conselected.conobj.groupId === -1) {
                if (this.props.contentchat.username === lastedchat) {
                    return (
                        //Your chat 1vs1
                        <div className='your-chat-item'>
                            <div style={{ width: '45px' }} className='avatar'>
                            </div>
                            <Tooltip placement="left" title={time}>
                                <div style={{ maxWidth:'75%'}} className='your-chat-info'>
                                    <div className='your-chat-content'>{this.props.contentchat.content}</div>
                                </div>
                            </Tooltip>
                        </div>
                    );
                }
                else {
                    lastedchat = this.props.contentchat.username;
                    return (
                        //Your chat 1vs1
                        <div className='your-chat-item'>
                            <div className='avatar'>
                                <Avatar size={45} icon="user" />
                            </div>
                            <Tooltip placement="left" title={time}>
                                <div style={{ maxWidth:'75%'}} className='your-chat-info'>
                                    <div className='your-chat-content'>{this.props.contentchat.content}</div>
                                </div>
                            </Tooltip>

                        </div>
                    );
                }

            }
            else {
                if (this.props.contentchat.username === lastedchat) {
                    return (
                        //Your chat group
                        <div className='your-chat-item'>
                            <div style={{ width: '45px' }} className='avatar'>
                            </div>
                            <div style={{display:'inline-block', maxWidth:'75%'}}>
                            <Tooltip placement="left" title={time}>
                                <div className='your-chat-info'>
                                    <div className='your-chat-content'>{this.props.contentchat.content}</div>
                                </div>
                            </Tooltip>
                            </div>
                        </div>
                    );
                }
                else {
                    lastedchat = this.props.contentchat.username;
                    return (
                        //Your chat group
                        <div className='your-chat-item'>
                            <div className='avatar'>
                                <Avatar size={45} icon="user" />
                            </div>
                            <div style={{display:'inline-block', maxWidth:'75%'}}>
                                <Tooltip placement="left" title={time}>
                                    <div className='your-chat-info'>
                                        <div className='user_chat'>{this.props.contentchat.username}</div>
                                        <div className='your-chat-content'>{this.props.contentchat.content}</div>
                                    </div>
                                </Tooltip>
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
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatItem);
