import React, { Component } from 'react';
import { Form, Icon, Input, Modal } from 'antd';
import axios from 'axios';
import { connect } from 'react-redux';
import { createConversation } from './../actions/ConversationActions';
import { saveListUser } from '../actions/UserActions'


const url = 'http://localhost:10010';
const FormItem = Form.Item;

class AddFriend extends Component {
    state = {
        modalAddFriend: false,
        visible: true,
    }
    componentDidMount() {
        var self = this;
        axios.get(url + '/users/getuser', {
            params: {
                token: this.props.sign.token
            }
        }).then(function (res) {
            if (res.data.status === 200) {
                var listuser = res.data.value.split(";");
                self.props.saveListUser(listuser);
            } else {
                console.log(res.data.message);
            }

        })
            .catch(function (error) {
                console.log(error);
            });
    }

    handleKeyPress = event => {
        if (event.key === 'Enter') {
            this.addFriend();
        }
    };

    addFriend() {
        this.props.form.validateFields( async (err, values) => {
            if (!err) {
                var self = this;
                var listcon = this.props.conversation.listConversation;
                var conId = 1;
                await axios.get(url + '/con/getlastedid', {
                    params: {
                        token: this.props.sign.token
                    }
                }).then(function (res) {
                    if (res.data.status === 200) {
                        conId += parseInt(res.data.value);
                    } else {
                        console.log(res.data.message);
                    }
        
                })
                    .catch(function (error) {
                        console.log(error);
                    });

                var objnewcon = {
                    conId: conId, 
                    username: values.userName,
                    groupId: -1, // check 1vs1
                    groupname: '',
                    unread: 0,
                    createUser: true,
                    lastedmsg: {}
                }

                await axios.post(url + '/con/create', {
                    objconversations: {
                        conobj: objnewcon,
                        token: this.props.sign.token
                    },
                }).then(function (res) {
                    if (res.data.status === 200) {
                        listcon.unshift(objnewcon);
                        self.props.createConversation(listcon);
                        var listusercur = self.props.listuser;
                        listusercur.push(values.userName);
                        self.props.saveListUser(listusercur);

                    } else {
                        console.log(res.data.message);
                    }

                })
                    .catch(function (error) {
                        console.log(error);
                    });
                this.setModalAddFriend(false);
            }
        });
    }
    setModalAddFriend(modalAddFriend) {
        this.setState({ modalAddFriend });
        this.props.form.setFieldsValue({
            userName: '',
        });
    }

    checkUniqueUser = (rule, value, callback) => {
        var list = this.props.listuser;
        var listuser = this.props.listalluser;
        if (value && list.includes(value)) {
            callback('Username already has conversation!');
        }
        else if (value && value === this.props.sign.user){
            callback('Can not add friend with yourself!');
        }
        else if (value && !listuser.includes(value)) {
            callback('Username does not exist!');
        }
        else {
            callback();
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <div className="add-friend" onClick={() => {
                    this.setModalAddFriend(true);
                }}>
                    <div className='add-new'>
                        <div className='add-new-icon'>
                            <Icon id='add-new-icon' type="user-add" theme="outlined" />
                        </div>
                        <div className='name'>
                            <span>Add new friend</span>
                        </div>
                    </div>
                </div>
                <Modal
                    width="400px"
                    title="Add new friend"
                    centered
                    visible={this.state.modalAddFriend}
                    onOk={() => this.addFriend()}
                    onCancel={() => this.setModalAddFriend(false)}
                >
                    <Form>
                        <p>Please enter username:</p>
                        <FormItem>
                            {getFieldDecorator('userName', {
                                rules: [{
                                    required: true, message: 'Please input username!'
                                }, {
                                    validator: this.checkUniqueUser,
                                }],
                            })(
                                <Input onKeyPress={this.handleKeyPress} placeholder="ex:toanhda" />
                            )}
                        </FormItem>

                    </Form>
                </Modal>
            </div>
        );
    }
}


const mapStateToProps = state => ({
    conversation: state.conversation,
    listuser: state.user.listuser,
    listalluser: state.listuser.listuser,
    sign: state.sign
});

const mapDispatchToProps = (dispatch) => ({
    createConversation: (listConversation) => dispatch(createConversation(listConversation)),
    saveListUser: (listuser) => dispatch(saveListUser(listuser)),
    });

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Form.create()(AddFriend));

