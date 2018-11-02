import React, { Component } from 'react';
import { Form, Icon, Input, Modal, Select, notification } from 'antd';
import axios from 'axios';
import { connect } from 'react-redux';
import { createConversation } from './../actions/ConversationActions';

const FormItem = Form.Item;
const Option = Select.Option;
const url = 'http://localhost:10010';
class AddGroup extends Component {
    state = {
        modalAddGroup: false,
        visible: true,
        listMember: []
    }
    handleChange = (value) => {
        this.setState({
            listMember: value,
        });


    }
    setModalAddGroup(modalAddGroup) {
        this.setState({ modalAddGroup });
    }
    addGroup() {
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                var self = this;
                var listcon = this.props.conversation.listConversation;
                var usernamestring = '';
                this.state.listMember.map((e) => {
                    usernamestring = usernamestring !== '' ? `${usernamestring};${e}` : `${e}`
                });
                var groupId = 1;
                await axios.get(url + '/group/getlastedid', {
                    params: {
                        token: this.props.sign.token
                    }
                }).then(function (res) {
                    if (res.data.status === 200) {
                        groupId += parseInt(res.data.value);
                    } else {
                        console.log(res.data.message);
                    }
                })
                    .catch(function (error) {
                        console.log(error);
                    });



                var objnewgroup = {
                    conId: -1, // check group
                    username: `${self.props.sign.user};${usernamestring}`,
                    groupId: groupId,
                    groupname: values.groupName,
                    unread: 0,
                    createUser: true,
                    lastedmsg: {}
                }
                axios.post(url + '/group/create', {
                    objgroup: {
                        conobj: objnewgroup,
                        token: this.props.sign.token
                    },
                }).then(function (res) {
                    if (res.data.status === 200) {
                        listcon.unshift(objnewgroup);
                        self.props.createConversation(listcon);

                        self.setModalAddGroup(false);

                    } else {
                        notification['error']({
                            message: 'Create group fail',
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

    checkGroupname = (rule, value, callback) => {
        if (!/^[a-zA-Z0-9]*$/.test(value)) {
          callback('Groupname has special character!');
        }
        else {
          callback();
        }
      }
    render() {
        const listalluser = this.props.listalluser;
        const { getFieldDecorator } = this.props.form;
        const listalluserOption = [];
        if (typeof this.props.listalluser !== "undefined") {
            var index = listalluser.indexOf(this.props.sign.user);
            if (index > -1) {
                listalluser.splice(index, 1);
            }
            listalluser.map((e) => {
                listalluserOption.push(<Option key={e}>{e}</Option>);
            });
        }
        return (
            <div>
                <div className="add-group" onClick={() => {
                    this.setModalAddGroup(true);
                    this.props.form.setFieldsValue({
                        groupName: '',
                        listmember: [],
                    })
                }}>
                    <div className='add-new'>
                        <div className='add-new-group-icon'>
                            <Icon id='add-new-group-icon' type="usergroup-add" theme="outlined" />
                        </div>
                        <div className='name'>
                            <span>Create a group</span>
                        </div>
                    </div>
                </div>
                <Modal
                    width="400px"
                    title="Create a group"
                    centered
                    visible={this.state.modalAddGroup}
                    onOk={() => this.addGroup()}
                    onCancel={() => this.setModalAddGroup(false)}
                >
                    <Form>
                        <p>Please enter info group:</p>
                        <FormItem>
                            {getFieldDecorator('groupName', {
                                rules: [{ required: true, message: 'Please input groupname!' }, {
                                    validator: this.checkGroupname,
                                }],
                            })(
                                <Input ref={(ref) => { this.txtGroupName = ref; }} id='group-name' placeholder="Group name" />
                            )}
                        </FormItem>

                        <FormItem>
                            {getFieldDecorator('listmember', {
                                rules: [{ required: true, message: 'Please input member!' }],
                            })(
                                <Select
                                    mode="multiple"
                                    style={{ width: '100%' }}
                                    placeholder="Please enter username"
                                    onChange={this.handleChange}
                                    allowClear={true}
                                >
                                    {listalluserOption}
                                </Select>
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
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)( Form.create()(AddGroup));