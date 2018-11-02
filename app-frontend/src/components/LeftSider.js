import React, { Component } from 'react';
import InfoUser from './InfoUser'
import MenuItem from './MenuItem'
import AddFriendGroup from './AddFriendGroup'
import axios from 'axios';
import { connect } from 'react-redux';
import { saveUserData } from '../actions/UserActions';
import { saveAllUser } from '../actions/ListUserAction'
import { saveConversationList } from '../actions/ConversationActions'


const url = 'http://localhost:10010';
class LeftSider extends Component {

    componentDidMount() {
        var self = this;
        axios.get(url + '/users/getdata', {
            params: {
                token: this.props.sign.token
            }
        }).then((res) => {
            if (res.data.status === 200) {
                var userData = res.data;
                userData.listConGroup.sort((a, b) => parseInt(b.lastedmsg.time) - parseInt(a.lastedmsg.time));
                self.props.saveUserData(userData);
                self.props.saveConversationList(userData.listConGroup);
            } else {
                console.log(res.data.message);
            }
        }).catch((err) => {
            console.log(err);
        })

        axios.get(url + '/users/getall', {
        }).then(function (res) {
            if (res.data.status === 200) {
                var listUserName = res.data.value.split(";");

                self.props.saveAllUser(listUserName);
            } else {
                console.log(res.data.message);
            }

        })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        return (
            <div>
                <div>
                    <InfoUser />
                    <AddFriendGroup />
                </div>
                <div>
                    <MenuItem />
                </div>

            </div>
        );
    }
}

const mapStateToProps = state => ({
    sign: state.sign,
    userdata : state.user
});

const mapDispatchToProps = (dispatch) => ({
    saveUserData: (user_data) => dispatch(saveUserData(user_data)),
    saveConversationList: (conlist) => dispatch(saveConversationList(conlist)),
    saveAllUser: (listuser) => dispatch(saveAllUser(listuser)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LeftSider);