import React, { Component } from 'react';
import { Layout } from 'antd';
import ChatHeader from './ChatHeader';
import ChatContent from './ChatContent';
import ChatFooter from './ChatFooter';
import { connect } from 'react-redux';
import { chatMessage } from '../actions/MessageActions';
import { changeCon } from '../actions/ChatFormActions';
const { Header, Content, Footer } = Layout;

class ChatForm extends Component {
  render() {
    if (this.props.conselected.conobj === '') {
      return '';
    }
    else {
      return (
        <Layout className='chat-form'>
          <Header>
            <ChatHeader />
          </Header>
          <Content style={{padding:'24px'}} id='chat-content'>
            <ChatContent  />
          </Content>
          <Footer>
            <ChatFooter />
          </Footer>
        </Layout>
      );
    }

  }
}


const mapStateToProps = state => ({
  sign: state.sign,
  conselected: state.conselected,
  message: state.message
});

const mapDispatchToProps = (dispatch) => ({
  chatMessage: (info) => dispatch(chatMessage(info)),
  changeCon: (conseleted) => dispatch(changeCon(conseleted))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatForm);