import React, { Component } from 'react';
import { Avatar, Icon, Modal, Form, Select, Tooltip } from 'antd';
import axios from 'axios';
import { connect } from 'react-redux';
import { addMember } from '../actions/GroupActions';
import {addMemberGroupUser} from '../actions/UserActions'


const url = 'http://localhost:10010';
const FormItem = Form.Item;
const Option = Select.Option;


class ChatHeader extends Component {

    state = {
        visible: false,
        listAddMember: [],
    }


    showModal = () => {
        this.setState({
            visible: true,
        });

        this.props.form.setFieldsValue({
            listmemberadd: [],
        })
    }

    handleOk = (e) => {
        var self = this;
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                var addmemberstr = '';
                this.state.listAddMember.map((e) => {
                    addmemberstr += addmemberstr === '' ? e : `;${e}`;
                });
                await axios.post(url + '/group/addmember', {
                    obj: {
                        groupId: this.props.conselected.conobj.groupId,
                        member: addmemberstr,
                        token: this.props.sign.token
                    },
                }).then(function (res) {
                    if (res.data.status === 200) {
                        var member = self.props.conselected.conobj.username;
                        self.props.addMember(`${member};${addmemberstr}`)
                        var listcon = self.props.listcon;
                        var key = 0;
                        listcon.map((e,i)=>{
                            if (e.groupId===self.props.conselected.conobj.groupId){
                                key = i
                            }
                        })
                        self.props.addMemberGroupUser(key, `${member};${addmemberstr}`)

                    } else {
                        console.log(res.data.message);
                    }

                })
                    .catch(function (error) {
                        console.log(error);
                    });
                

                this.setState({
                    visible: false,
                });

            }
        });
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }

    handleChange = (value) => {
        this.setState({
            listAddMember: value,
        });


    }
    render() {
        const { getFieldDecorator } = this.props.form;
        var objcon = ''
        if (typeof this.props.conselected !== 'undefined') {
            objcon = this.props.conselected.conobj;
        }
        if (objcon !== '') {
            if (objcon.groupId !== -1) {

                var listmember = objcon.username.split(";");;;
                var listalluser = this.props.listuser;
                var sub = listalluser.filter((el) => {
                    return listmember.indexOf(el) < 0;
                });
                var listuserOptionAdd = [];
                sub.map((e, i) => {
                    listuserOptionAdd.push(<Option key={e}>{e}</Option>);
                });

                function member() {
                    Modal.info({
                        title: 'List member',
                        content: (
                            <div>
                                {listmember.map((e, i) => {
                                    return <div key={i}>
                                        <div className='avatar'>
                                            <Avatar size={45} icon="user" />
                                        </div>
                                        <div style={{
                                            display: 'inline-block',
                                        }} className='user-item-name'>
                                            <span>{e}</span>
                                        </div>
                                    </div>
                                })}
                            </div>
                        ),
                        onOk() { },
                    });
                }


                return (
                    //Chat group
                    <div>
                        <div className='user-item'>
                            <div className='avatar'>
                                <Avatar size={45} icon="team" />
                            </div>
                            <div className='user-item-name'>
                                <span className = 'name'>{objcon.groupname}</span>
                                <br />
                                <Icon onClick={member} className='member-group' type="solution" theme="outlined" />
                                <Icon onClick={this.showModal} className='add-member-to-group' type="plus-circle" theme="outlined" />
                            </div>
                        </div>
                        <Modal
                            title="Add new member"
                            visible={this.state.visible}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                        >
                            <Form>
                                <FormItem>
                                    {getFieldDecorator('listmemberadd', {
                                        rules: [{ required: true, message: 'Please input member!' }],
                                    })(
                                        <Select
                                            mode="multiple"
                                            style={{ width: '100%' }}
                                            placeholder="Please enter username"
                                            onChange={this.handleChange}
                                            allowClear={true}
                                        >
                                            {listuserOptionAdd}
                                        </Select>
                                    )}
                                </FormItem>
                            </Form>
                        </Modal>
                    </div>
                );
            } else {
                return (
                    // Chat 1vs1
                    <div className='user-item'>
                        <div className='avatar'>
                            <Avatar size={45} icon="user" />
                        </div>
                        <div className='user-item-name'>
                            <span className='name'>{objcon.username}</span>
                            <br />
                            <Tooltip title={this.props.statusfriend}>
                            <span className='status'>{this.props.statusfriend}</span>
                            </Tooltip>
                            
                        </div>
                    </div>
                );
            }


        }
        else return ''
    }

}


const mapStateToProps = state => ({
    sign: state.sign,
    conselected: state.conselected,
    statusfriend: state.statusfriend,
    listuser: state.listuser.listuser,
    listcon:  state.conversation.listConversation
});

const mapDispatchToProps = (dispatch) => ({
    addMember: (member) => dispatch(addMember(member)),
    addMemberGroupUser: (id, member) => dispatch(addMemberGroupUser(id, member))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Form.create()(ChatHeader));