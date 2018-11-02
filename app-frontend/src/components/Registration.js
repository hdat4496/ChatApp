import { Form, Input, Button, notification } from 'antd';
import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { login } from '../actions/SignActions';
import { pageMain } from '../actions/PageActions';
import { saveAllUser } from '../actions/ListUserAction';
const FormItem = Form.Item;
const url = 'http://localhost:10010';

class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
  };

  componentDidMount() {
    // var self = this;
    // axios.get(url + '/users/getall', {
    // }).then(function (res) {
    //   if (res.data.status === 200) {
    //     var listUserName = res.data.value.split(";");
        
    //     self.props.saveAllUser(listUserName);
    //   } else {
    //     console.log(res.data.message);
    //   }

    // })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
  }

  signUp = (e) => {
    var self = this;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        axios.post(url + '/users/signup', {
          user_info_signup: {
            username: values.username,
            password: values.password
          }
        }).then(function (res) {
          if (res.data.status === 200) {
            self.props.login(res.data.user, res.data.token);
            self.props.pageMain();
            localStorage.setItem("username", res.data.user);
            localStorage.setItem("token", res.data.token);
          } else {
            notification['error']({
              message: 'Sign-up fail',
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

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  checkUniqueUser = async (rule, value, callback) => {
    // var list = this.props.listuser.listuser;
    // var existeduser = false;
    //   await axios.get(url + '/users/checkexisteduser', {
    //     params: {
    //       username: value
    //   }
    //   }).then(function (res) {
    //     if (res.data.status === 200) {
    //       if(res.data.value==='1'){
    //         existeduser = true;
    //       }
    //     } else {
    //       console.log(res);
    //     }

    //   })
    //     .catch(function (error) {
    //       console.log(error);
    //     });

    // if (value && existeduser) {
    //   await callback('Username already exists!');
    // }
    if (!/^[a-zA-Z0-9]*$/.test(value)) {
      await callback('Username has special character!');
    }
    else {
      await callback();
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    return (
      <Form className='registration-form' onSubmit={this.signUp}>
        <FormItem
          {...formItemLayout}
          label={(
            <span>
              Username
            </span>
          )}
        >
          {getFieldDecorator('username', {
            rules: [{
              required: true, message: 'Please confirm your username!',
            },{
              validator: this.checkUniqueUser,
            }],
          })(
            <Input />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Password"
        >
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: 'Please input your password!',
            }, {
              validator: this.validateToNextPassword,
            }],
          })(
            <Input type="password" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Confirm Password"
        >
          {getFieldDecorator('confirm', {
            rules: [{
              required: true, message: 'Please confirm your password!',
            }, {
              validator: this.compareToFirstPassword,
            }],
          })(
            <Input type="password" onBlur={this.handleConfirmBlur} />
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button className='register-button' type="primary" htmlType="submit">Register</Button>
        </FormItem>
      </Form>
    );
  }
}


const mapStateToProps = state => ({
  sign: state.sign,
  user: state.user,
  listuser: state.listuser
})

const mapDispatchToProps = (dispatch) => ({
  pageMain: () => dispatch(pageMain()),
  login: (userName, token) => dispatch(login(userName, token)),
  saveAllUser: (listuser) => dispatch(saveAllUser(listuser)),
});

const Registration = Form.create()(RegistrationForm);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Registration);