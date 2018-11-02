import React, { Component } from 'react';
import { Menu } from 'antd';
import UserItem from './UserItem'
import { connect } from 'react-redux';
class MenuItem extends Component {
    render() {
        var listConGroup = this.props.conversation.listConversation;
        return (
            <Menu className='menu-item' mode="inline" >
                {listConGroup.map((e, i) => {
                    if (!Object.keys(e.lastedmsg).length && !e.createUser) {
                        return '';
                    }
                    else {
                        if (e.conId !== -1) {
                            return <Menu.Item key={e.username}>
                                <UserItem
                                    key={e.username}
                                    conobj={e} />
                            </Menu.Item>;
                        }  else {
                            return <Menu.Item key={e.groupId}>
                            <UserItem
                                key={e.groupId}
                                conobj={e}/>
                        </Menu.Item>;
                        }

                    }
                }
                )}
            </Menu>
        );
    }
}
const mapStateToProps = state => ({
    sign: state.sign,
    conversation: state.conversation,
    group: state.group,
    userdata : state.user
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MenuItem);