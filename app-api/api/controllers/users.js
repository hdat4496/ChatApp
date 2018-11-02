'use strict';

const { get, putSync } = require('../helpers/db');
const { generateToken, checkToken } = require('../helpers/token');
// const { runData } = require('../helpers/data.js');
const crypto = require('crypto');
module.exports = {
    login: login,
    signup: signUp,
    getalluser: getalluser,
    getusercon: getusercon,
    getdata: getdata,
    setstatus: setstatus,
    getstatus: getstatus,
    checkExistedUser: checkExistedUser,
    test: test,

};

function test(req, res) {
    get(`u.toan.groups`, (err, value) => {
        if (!err) {
            res.json({ status: 200, message: value });
        }
    });
}

function checkExistedUser(req, res) {
    var username = req.swagger.params.username.value;
    get(`u.${username}`, (err, value) => {
        if (err) {
            if (err.notFound) {
                res.json({
                    status: 200,
                    value: '0' // not ExistedUser
                });
            }
        }
        else {
            res.json({
                status: 200,
                value: '1' //ExistedUser
            });
        }
    });
}


function login(req, res) {
    var user = req.swagger.params.user_info.value.user_info.username;
    var password = crypto.createHash('sha256').update(req.swagger.params.user_info.value.user_info.password).digest('base64');
    get(`u.${user}`, (err, value) => {
        if (!err && value == password) {
            var token = generateToken(user);
            console.log(token);
            res.json({
                status: 200,
                user: user,
                expire: Date.now() + 2592000000,
                token: token
            });
        } else {
            res.json({ status: 400, message: 'User name or password is not correct' });
        }
    });
}

function signUp(req, res) {
    var user = req.swagger.params.user_info_signup.value.user_info_signup.username;
    var password = crypto.createHash('sha256').update(req.swagger.params.user_info_signup.value.user_info_signup.password).digest('base64');
    try {
        if(typeof user !=="undefined" && typeof password !== "undefined" && /^[a-zA-Z0-9]*$/.test(user)){
            get(`u.${user}`, (err, value) => {
                if (err) {
                    if (err.notFound) {
                        get(`u.all.user`, (err, value) => {
                            if (!err) {
                                putSync(`u.${user}`, password);
                                putSync(`u.${user}.status`, '');
                                putSync(`u.${user}.groups`, '');
                                putSync(`u.${user}.cons`, '');
                                putSync(`u.${user}.user`, '');
                                putSync(`u.all.user`, value + ';' + user);
                                var token = generateToken(user);
                                console.log('22222222222222222');
                                console.log(token);
                                res.json({
                                    status: 200,
                                    user: user,
                                    expire: Date.now() + 2592000000,
                                    token: token
                                });
                            }
                            else {
                                res.json({ status: 404, message: '404 Not found' });
                            }
    
                        });
                    }
                    else {
                        res.json({ status: 400, message: 'Registration fail' });
                    }
                } else {
                    res.json({ status: 400, message: 'User name already exists' });
                }
            });
        } else {
            res.json({ status: 400, message: 'Username and password is require' });
        }

    } catch (err) {
        res.json({ status: 400, message: 'Registration fail' });
    }
}

function getalluser(req, res) {
    get(`u.all.user`, (err, value) => {
        if (!err) {
            res.json({
                status: 200,
                value: value
            });
        } else {
            res.json({ status: 400, message: 'Get all user fail !' });
        }
    });
}


function getusercon(req, res) {
    var token = req.swagger.params.token.value;
    var check = checkToken(token);
    if (check.isValid && !check.isExpired) {
        get(`u.${check.user}.user`, (err, value) => {
            if (!err) {
                res.json({
                    status: 200,
                    value: value
                });
            } else {
                res.json({ status: 400, message: 'Get user fail !' });
            }
        });
    }
    else {
        res.json({ status: 400, message: 'Token is invalid or expired' });
    }
}

function getdata(req, res) {
    var token = req.swagger.params.token.value;
    var check = checkToken(token);
    if (check.isValid && !check.isExpired) {
        var status = '', listConGroup = [];
        var listCon = [], listGroup = [];

        get(`u.${check.user}.status`, (err, value) => {
            if (!err) {
                status = value;
                get(`u.${check.user}.cons`, (err, value) => {
                    if (!err) {
                        if (value !== '') {
                            listCon = value.split(";");
                        }

                        get(`u.${check.user}.groups`, (err, value) => {
                            if (!err) {
                                if (value !== '') {
                                    listGroup = value.split(";");
                                }
                                if (listCon.length + listGroup.length === 0) {
                                    res.json({
                                        status: 200,
                                        user: check.user,
                                        userStatus: status,
                                        listConGroup: listConGroup
                                    });
                                }
                                listGroup.map((e, i) => {
                                    get(`group.${e}`, (err, value) => {
                                        if (!err) {
                                            var groupname = value;
                                            var createUser = false;
                                            get(`group.${e}.user`, (err, value) => {
                                                if (!err) {
                                                    var userstring = value;
                                                    var users = value.split(";");
                                                    var index = users.indexOf(check.user);
                                                    if (index === 0) {
                                                        createUser = true;
                                                    }
                                                    get(`group.${e}.lastedmsg`, (err, value) => {
                                                        if (!err) {
                                                            var unread = 0;
                                                            var objLastMsg = {}
                                                            if (parseInt(value) != 0) {
                                                                var lastedMsgID = parseInt(value);
                                                                get(`group.${e}.msg.${lastedMsgID}`, (err, value) => {
                                                                    if (!err) {
                                                                        var msgcontent = value.split(";");
                                                                        var lastedMsgUser = msgcontent[1];
                                                                        var lastedMsgContent = msgcontent[2];
                                                                        var lastedMsgTime = parseInt(msgcontent[0]);
                                                                        objLastMsg = {
                                                                            id: lastedMsgID,
                                                                            username: lastedMsgUser,
                                                                            content: lastedMsgContent,
                                                                            time: lastedMsgTime
                                                                        }
                                                                        get(`group.${e}.read.${check.user}`, (err, value) => {
                                                                            if (!err) {
                                                                                unread = lastedMsgID - parseInt(value);
                                                                                var objConGroup = {
                                                                                    conId: -1,
                                                                                    username: userstring,
                                                                                    groupId: parseInt(e),
                                                                                    groupname: groupname,
                                                                                    unread: unread,
                                                                                    createUser: createUser,
                                                                                    lastedmsg: objLastMsg
                                                                                }
                                                                                listConGroup.push(objConGroup);
                                                                                if (listConGroup.length == (listCon.length + listGroup.length)) {
                                                                                    res.json({
                                                                                        status: 200,
                                                                                        user: check.user,
                                                                                        userStatus: status,
                                                                                        listConGroup: listConGroup
                                                                                    });
                                                                                }
                                                                            }
                                                                            else {
                                                                                res.json({ status: 404, message: '404 Not found' });
                                                                            }
                                                                        });
                                                                    }
                                                                    else {
                                                                        res.json({ status: 404, message: '404 Not found' });
                                                                    }
                                                                });
                                                            } else {
                                                                var objConGroup = {
                                                                    conId: -1,
                                                                    username: userstring,
                                                                    groupId: parseInt(e),
                                                                    groupname: groupname,
                                                                    unread: 0,
                                                                    createUser: createUser,
                                                                    lastedmsg: {}
                                                                }
                                                                listConGroup.push(objConGroup);
                                                                if (listConGroup.length == (listCon.length + listGroup.length)) {
                                                                    res.json({
                                                                        status: 200,
                                                                        user: check.user,
                                                                        userStatus: status,
                                                                        listConGroup: listConGroup
                                                                    });
                                                                }
                                                            }
                                                        }
                                                        else {
                                                            res.json({ status: 404, message: '404 Not found' });
                                                        }
                                                    });
                                                }
                                                else {
                                                    res.json({ status: 404, message: '404 Not found' });
                                                }
                                            });
                                        }
                                        else {
                                            res.json({ status: 404, message: '404 Not found' });
                                        }
                                    });
                                });
                            }
                            else {
                                res.json({ status: 404, message: '404 Not found' });
                            }
                        });
                        listCon.map((e, i) => {
                            get(`con.${e}.user`, (err, value) => {
                                if (!err) {
                                    var createUser = false;
                                    var users = value.split(";");
                                    var index = users.indexOf(check.user);
                                    if (index === 0) {
                                        createUser = true;
                                    }
                                    if (index > -1) {
                                        users.splice(index, 1);
                                    }
                                    var idCon = parseInt(e);
                                    var username = users[0];
                                    get(`con.${e}.lastedmsg`, (err, value) => {
                                        if (!err) {
                                            var unread = 0;
                                            var objLastMsg = {}
                                            if (parseInt(value) != 0) {
                                                var lastedMsgID = parseInt(value);
                                                get(`con.${e}.msg.${lastedMsgID}`, (err, value) => {
                                                    if (!err) {
                                                        var msgcontent = value.split(";");
                                                        var lastedMsgUser = msgcontent[1];
                                                        var lastedMsgContent = msgcontent[2];
                                                        var lastedMsgTime = parseInt(msgcontent[0]);
                                                        objLastMsg = {
                                                            id: lastedMsgID,
                                                            username: lastedMsgUser,
                                                            content: lastedMsgContent,
                                                            time: lastedMsgTime
                                                        }
                                                        get(`con.${e}.read.${check.user}`, (err, value) => {
                                                            if (!err) {
                                                                unread = lastedMsgID - parseInt(value);
                                                                var objConGroup = {
                                                                    conId: idCon,
                                                                    username: username,
                                                                    groupId: -1,
                                                                    groupname: '',
                                                                    unread: unread,
                                                                    createUser: createUser,
                                                                    lastedmsg: objLastMsg
                                                                }
                                                                listConGroup.push(objConGroup);
                                                                if (listConGroup.length == (listCon.length + listGroup.length)) {
                                                                    res.json({
                                                                        status: 200,
                                                                        user: check.user,
                                                                        userStatus: status,
                                                                        listConGroup: listConGroup
                                                                    });
                                                                }
                                                            }
                                                            else {
                                                                res.json({ status: 404, message: '404 Not found' });
                                                            }
                                                        });
                                                    }
                                                    else {
                                                        res.json({ status: 404, message: '404 Not found' });
                                                    }
                                                });
                                            }
                                            else {
                                                var objConGroup = {
                                                    conId: idCon,
                                                    username: username,
                                                    groupId: -1,
                                                    groupname: '',
                                                    unread: 0,
                                                    createUser: createUser,
                                                    lastedmsg: {}
                                                }
                                                listConGroup.push(objConGroup);
                                                if (listConGroup.length == (listCon.length + listGroup.length)) {
                                                    res.json({
                                                        status: 200,
                                                        user: check.user,
                                                        userStatus: status,
                                                        listConGroup: listConGroup
                                                    });

                                                }
                                            }
                                        }
                                        else {
                                            res.json({ status: 404, message: '404 Not found' });
                                        }
                                    });
                                }
                                else {
                                    res.json({ status: 404, message: '404 Not found' });
                                }
                            });
                        })
                    }
                    else {
                        res.json({ status: 404, message: '404 Not found' });
                    }
                });
            }
            else {
                res.json({ status: 404, message: '404 Not found' });
            }
        });

    } else {
        res.json({ status: 400, message: 'Token is invalid or expired' });
    }
}


function setstatus(req, res) {
    var status = req.swagger.params.userStatus.value.userStatus.userStatus;
    var token = req.swagger.params.userStatus.value.userStatus.token;
    var check = checkToken(token);
    if (check.isValid && !check.isExpired) {
        putSync(`u.${check.user}.status`, status);
        res.json({ status: 200, message: 'Set status successful!' });
    }
    else {
        res.json({ status: 400, message: 'Token is invalid or expired' });
    }
}

function getstatus(req, res) {
    var token = req.swagger.params.token.value;
    var username = req.swagger.params.username.value;

    var check = checkToken(token);
    if (check.isValid && !check.isExpired) {
        get(`u.${username}.status`, (err, value) => {
            if (!err) {
                res.json({ status: 200, value: value });
            }
            else {
                res.json({ status: 404, message: '404 Not found' });
            }
        });

    }
    else {
        res.json({ status: 400, message: 'Token is invalid or expired' });
    }
}