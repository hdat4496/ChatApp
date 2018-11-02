import React, { Component } from 'react';
import AddFriend from './AddFriend';
import AddGroup from './AddGroup';
import { connect } from 'react-redux';
import { createConversation } from './../actions/ConversationActions';

class AddFriendGroup extends Component {
    render() {
        return (
            <div>
                <div className="menu-add">
                    <AddFriend/>
                    <AddGroup/>                    
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    conversation: state.conversation,
    group: state.group
});

const mapDispatchToProps = (dispatch) => ({
    createConversation: (info) => dispatch(createConversation(info)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddFriendGroup);
