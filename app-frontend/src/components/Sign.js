import React, { Component } from 'react';
import { Tabs } from 'antd';
import Registration from './Registration';
import Login from './Login';
import { connect } from 'react-redux';
import { login } from '../actions/SignActions';
import { pageMain } from '../actions/PageActions';

const TabPane = Tabs.TabPane;
function callback(key) {
    console.log(key);
}

class Sign extends Component {
    componentDidMount() {
        var user = localStorage.getItem("username");
        var token = localStorage.getItem("token");
        if (user && token) {
          this.props.login(user, token);
          this.props.pageMain();
        }
      }
    render() {
        return (
            <Tabs className='login-registration-form' defaultActiveKey="login" onChange={callback}>
                <TabPane className='pane-login' tab="Login" key="login">
                    <Login/>
                </TabPane>
                <TabPane className='pane-registration' tab="Registration" key="registration">
                    <Registration/>
                </TabPane>
            </Tabs>
        );
    }
}

const mapStateToProps = state => ({
    sign: state.sign
});

const mapDispatchToProps = (dispatch) => ({
    pageMain: () => dispatch(pageMain()),
    login: (userName, token) => dispatch(login(userName, token))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Sign);