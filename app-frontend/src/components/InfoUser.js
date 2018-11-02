import React, { Component } from 'react';
import { Icon, Input, Avatar, Modal, Tooltip } from 'antd';
import axios from 'axios';
import { connect } from 'react-redux';
import { pageSign } from './../actions/PageActions';
import { logOut, disconnectSocket } from '../actions/SignActions';
import { saveStatus, logoutUserData, logoutStatusFriend } from '../actions/UserActions';
import {logoutConselected}  from '../actions/ChatFormActions';
import {logoutConversation}  from '../actions/ConversationActions';
import {logoutListUser}  from '../actions/ListUserAction';
import {logoutMessage}  from '../actions/MessageActions';

const url = 'http://localhost:10010';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
});

class InfoUser extends Component {
  state = { visible: false }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = (e) => {
    var { sign } = this.props;
    var self = this;
    var userStatus = this.txtNewStatus.input.value;
    axios.post(url + '/users/setstatus', {
      userStatus: {
        userStatus: userStatus,
        token: self.props.sign.token
      }
    }).then(function (res) {
      if (res.data.status === 200) {
        self.props.saveStatus(userStatus);

        sign.connection.send(JSON.stringify({
          type: 'SETSTATUS',
          token: sign.token,
          status: userStatus
      }));

        self.txtNewStatus.input.value = '';
        self.setState({
          visible: false,
        });
      } else {
        console.log(res.data.message);
      }

    })
      .catch(function (error) {
        console.log(error);
      });


  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
    this.txtNewStatus.input.value = ''
  }

  logout = () => {
    this.props.sign.connection.send(JSON.stringify({
      type: 'DISCONNECT',
      token: this.props.sign.token
    }));

    this.props.sign.connection.close();
    this.props.disconnectSocket();
    this.props.logOut();
    this.props.pageSign();
    this.props.logoutUserData();
    this.props.logoutConselected();
    this.props.logoutConversation();
    this.props.logoutListUser();
    this.props.logoutMessage();
    this.props.logoutStatusFriend();
    localStorage.removeItem('username');
    localStorage.removeItem('token');
  }

  handleKeyPress = event => {
    if (event.key === 'Enter') {
      this.handleOk();
    }
  };

  render() {
    var userData = this.props.userdata;
    var user = '';
    var status = '';
    if (userData) {
      user = userData.user.user;
      status = userData.user.userStatus;
    }
    return (
      <div className="info">
        <div onClick={this.showModal} className='avatar'>
          <Avatar size={45} icon="user" />
        </div>
        <div className='name'>
          <span>{user}</span>
          <br />
          <Tooltip title={status}>
            <span className='status'>{status}</span>
          </Tooltip>
        </div>
        <div className='logout'>
          <Tooltip title='Logout'>
            <IconFont onClick={this.logout} id='logout' type="icon-tuichu" />
          </Tooltip>

        </div>

        <Modal
          title="Change status"
          width="350px"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Input className='input-status' ref={(ref) => { this.txtNewStatus = ref; }} onKeyPress={this.handleKeyPress} style={{ marginTop: '10px' }} placeholder="New status" />
        </Modal>
      </div>
    );
  }
}


const mapStateToProps = state => ({
  sign: state.sign,
  userdata : state.user
});

const mapDispatchToProps = (dispatch) => ({
  disconnectSocket: () => dispatch(disconnectSocket()),
  pageSign: () => dispatch(pageSign()),
  logOut: () => dispatch(logOut()),
  saveStatus: (status) => dispatch(saveStatus(status)),
  logoutUserData: () => dispatch(logoutUserData()),
  logoutConselected: () => dispatch(logoutConselected()),
  logoutConversation: () => dispatch(logoutConversation()),
  logoutListUser: () => dispatch(logoutListUser()),
  logoutMessage: () => dispatch(logoutMessage()),
  logoutStatusFriend: () => dispatch(logoutStatusFriend()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InfoUser);
