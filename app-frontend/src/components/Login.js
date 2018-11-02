import React, { Component } from 'react';
import { Form, Icon, Input, Button, notification } from 'antd';
import axios from 'axios';
import { connect } from 'react-redux';
import { login } from '../actions/SignActions';
import { pageSign, pageMain } from '../actions/PageActions';


const FormItem = Form.Item;
const url = 'http://localhost:10010';


class LoginForm extends Component {
  handleLogin = (e) => {
    var self=this;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        axios.post(url + '/users/login', {
          user_info: {
            username: values.userName,
            password: values.password
          }
        }).then(function (res) {
          if (res.data.status === 200) {
            localStorage.setItem("username", values.userName);
            localStorage.setItem("token", res.data.token);
            self.props.login(values.userName, res.data.token);
            self.props.pageMain();

          } else {
            notification['error']({
              message: 'Login fail',
              description: res.data.message
            });
          }

        })
          .catch(function (error) {
            console.log(error);
          });
      }
    });
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleLogin} className="login-form">
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input className='first-input' prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
          )}
        </FormItem>
        <FormItem>

          <Button style={{ display: 'block' }} type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
        </FormItem>
      </Form>
    );
  }
}
const Login = Form.create()(LoginForm);




const mapStateToProps = state => ({
  sign: state.sign
})

const mapDispatchToProps = (dispatch) => ({
  pageSign: () => dispatch(pageSign()),
  pageMain: () => dispatch(pageMain()),
  login: (userName, token) => dispatch(login(userName, token))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
