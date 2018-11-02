import React, { Component } from 'react';
import { Layout, notification, Icon } from 'antd';
import ChatForm from './ChatForm';
import LeftSider from './LeftSider';
import { connect } from 'react-redux';
import { connectSocket, saveUserOnline, saveNewOnline } from '../actions/SignActions';
import { saveMessage } from '../actions/MessageActions';
import { saveUserData } from '../actions/UserActions';
import { saveAllUser } from '../actions/ListUserAction';
import {saveStatusFriend} from '../actions/ConversationActions';
import { saveConversationList } from '../actions/ConversationActions';
import axios from 'axios';
const url = 'http://localhost:10010';
const { Sider } = Layout;
class Main extends Component {
  componentDidMount = () => {
    const { sign } = this.props;
    if (sign.connection === null) {
      this.props.connectSocket(this.createConnection());
    }
  }
  createConnection() {
    const connection = new WebSocket('ws://localhost:10000');
    connection.onopen = this.connectionOpened;
    connection.onmessage = this.connectionMessage;
    connection.onclose = this.connectionClosed;
    connection.onerror = this.connectionError;
    return connection;
  }
  connectionOpened = (e) => {
    const { sign } = this.props;

    sign.connection.send(JSON.stringify({
      type: 'CONNECT',
      user: sign.user,
      token: sign.token
    }));
  }
  connectionMessage = (e) => {
    const data = JSON.parse(e.data);
    switch (data.type) {
      case 'SETSTATUS':
        var { conselected } = this.props;
        
        if(conselected.conobj && conselected.conobj.username ===data.userchange){
          this.props.saveStatusFriend(data.data);
        }
        break;
      case 'USERONLINE':
        this.props.saveUserOnline(data.data)
        break;
      case 'NEWONLINE':
        var useronlinecurr = this.props.sign.useronline;
        if (!useronlinecurr.includes(data.data) && this.props.listuserfriend.includes(data.data)) {
          notification.open({
            placement: 'topRight',
            message: `${data.data} is online`,
            icon: <Icon type="smile" style={{ color: 'rgb(18, 233, 16)' }} />
          });
          useronlinecurr.push(data.data);
        }
        this.props.saveUserOnline(useronlinecurr);
        this.props.saveNewOnline(data.data);
        break;
      case 'SEND_MESSAGE':
        var { userData } = this.props;
        const newUserData = { ...userData };
        if (data.type_con_group === 'group') {

          if (this.props.conselected && this.props.conselected.conobj.groupId === data.id) {
            this.props.saveMessage(data.listmessage);
          }
          else if ((this.props.conselected && this.props.conselected.conobj.groupId !== data.id && data.usersend !== this.props.sign.user) || !this.props.conselected.conobj) {
            notification.open({
              placement: 'topRight',
              message: `New message from group ${data.groupname}`,
              icon: <Icon type="smile" style={{ color: 'rgb(18, 233, 16)' }} />
            });
          }
          var newgroup = {};
          var flagnewgroup = true;
          newUserData.listConGroup.map((e, i) => {
            if (e.groupId === data.id) {
              flagnewgroup = false;
              if ((this.props.conselected && this.props.conselected.conobj.groupId !== data.id && data.usersend !== this.props.sign.user) || !this.props.conselected.conobj) {
                var idlastedmsgold = e.lastedmsg.id;
                if (typeof e.lastedmsg.id!== "undefined"){
                  var idlastedmsgold = e.lastedmsg.id;
                  e.unread += (data.lastedmsg.id - idlastedmsgold);
                } else {
                  e.unread += data.lastedmsg.id;
                }
              }
              e.lastedmsg = data.lastedmsg;
            }
          });
          if (flagnewgroup) {
            newgroup = {
              conId: -1,
              username: data.username,
              groupId: data.id,
              groupname: data.groupname,
              unread: data.lastedmsg.id,
              createUser: false,
              lastedmsg: data.lastedmsg
            }
            newUserData.listConGroup.unshift(newgroup);
          }
        } else {
          var useronline = [...this.props.sign.useronline];
          if (!useronline.includes(data.usersend)){
            useronline.push(data.usersend);
            this.props.saveUserOnline(useronline);
          }
          if ((this.props.conselected && this.props.conselected.conobj.username !== data.usersend && data.usersend !== this.props.sign.user) || !this.props.conselected) {
            notification.open({
              placement: 'topRight',
              message: `New message from ${data.usersend}`,
              icon: <Icon type="smile" style={{ color: 'rgb(18, 233, 16)' }} />
            });
          }
          else {
            this.props.saveMessage(data.listmessage);
          }
          var newcon = {};
          var flagnewcon = true;
          newUserData.listConGroup.map((e, i) => {
            if (e.conId === data.id) {
              flagnewcon = false;
              if ((this.props.conselected && this.props.conselected.conobj.username !== data.usersend && data.usersend !== this.props.sign.user) || !this.props.conselected) {
                
                console.log(e);
                console.log(e.lastedmsg.id);
                console.log(e.lastedmsg);
                if (typeof e.lastedmsg.id!== "undefined"){
                  var idlastedmsgold = e.lastedmsg.id;
                  e.unread += (data.lastedmsg.id - idlastedmsgold);
                } else {
                  e.unread += data.lastedmsg.id;
                }

              }
              e.lastedmsg = data.lastedmsg;
            }
          });
          if (flagnewcon) {
            newcon = {
              conId: data.id,
              username: data.usersend,
              groupId: -1,
              groupname: '',
              unread: 1,
              createUser: false,
              lastedmsg: data.lastedmsg
            }
            newUserData.listConGroup.unshift(newcon);
          }
        }
        newUserData.listConGroup.sort((a, b) => parseInt(b.lastedmsg.time) - parseInt(a.lastedmsg.time));
        this.props.saveUserData(newUserData);
        this.props.saveConversationList(newUserData.listConGroup);
        break;
      default:
        break;
    }
  }
  connectionClosed(e) {
    console.log('Close connection');
  }
  connectionError(e) {
    console.log('Connection Error');
  }

  render() {
    return (
      <Layout style={{ height: '100vh' }} className='main-form'>
        <Sider
          breakpoint="lg"
          width="280"
          collapsedWidth="0"
          onBreakpoint={(broken) => { console.log(broken); }}
          onCollapse={(collapsed, type) => { 
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
           }}
        >
          <LeftSider />
        </Sider>
        <ChatForm />
      </Layout>
    );
  }
}
const mapStateToProps = state => ({
  sign: state.sign,
  conselected: state.conselected,
  userData: state.user.user,
  listuserfriend : state.user.listuser,
});

const mapDispatchToProps = (dispatch) => ({
  connectSocket: (connection) => dispatch(connectSocket(connection)),
  saveUserOnline: (userOnline) => dispatch(saveUserOnline(userOnline)),
  saveNewOnline: (user) => dispatch(saveNewOnline(user)),
  saveUserData: (user_data) => dispatch(saveUserData(user_data)),
  saveMessage: (listMessage) => dispatch(saveMessage(listMessage)),
  saveAllUser: (listuser) => dispatch(saveAllUser(listuser)),
  saveStatusFriend: (status) => dispatch(saveStatusFriend(status)),
  saveConversationList: (conlist) => dispatch(saveConversationList(conlist)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);
