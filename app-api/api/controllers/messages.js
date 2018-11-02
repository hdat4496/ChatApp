'use strict';
const { get, putSync } = require('../helpers/db');
const { checkToken } = require('../helpers/token');

// const { runData } = require('../helpers/data.js')
module.exports = {
    getlistmessage: getlistmessage,
    sendmessage: sendmessage,
    getlastedmsg: getlastedmsg,
    updateunread: updateunread
};

function getlistmessage(req, res) {
    var token = req.swagger.params.token.value;
    var id = req.swagger.params.id.value;
    var type = req.swagger.params.type.value;
    var listmessage = [];
    var check = checkToken(token);
    if (check.isValid && !check.isExpired) {
        if (type === 'group') {
            get(`group.${id}.lastedmsg`, (err, value) => {
                if (!err) {
                    var numbermessage = parseInt(value);
                    var getMessage = (i, callback) => {
                        if (i > numbermessage) {
                            callback();
                            return;
                        }
                        get(`group.${id}.msg.${i}`, (err, value) => {
                            if (!err) {
                                var objmessage = value.split(';');
                                listmessage.push({
                                    id: parseInt(i),
                                    username: objmessage[1],
                                    content: objmessage[2],
                                    time: parseInt(objmessage[0])
                                });
                                getMessage(i + 1, callback);
                            }
                            else{
                                res.json({ status: 404, message: '404 Not found' });
                            }
                        })
                    }
                    getMessage(1, () => {
                        res.json({ status: 200, listmessage: listmessage });
                    });
                }
                else {
                    res.json({ status: 404, message: '404 Not found' });
                }
            });
        }
        else {
            get(`con.${id}.lastedmsg`, (err, value) => {
                if (!err) {
                    var numbermessage = parseInt(value);
                    var getMessage = (i, callback) => {
                        if (i > numbermessage) {
                            callback();
                            return;
                        }
                        get(`con.${id}.msg.${i}`, (err, value) => {
                            var objmessage = value.split(';');
                            listmessage.push({
                                id: parseInt(i),
                                username: objmessage[1],
                                content: objmessage[2],
                                time: parseInt(objmessage[0])
                            });
                            getMessage(i + 1, callback);
                        })
                    }
                    getMessage(1, () => {
                        res.json({ status: 200, listmessage: listmessage });
                    });
                }
                else {
                    res.json({ status: 404, message: '404 Not found' });
                }
            });
        }
    }
    else {
        res.json({ status: 400, message: 'Token is invalid or expired' });
    }
}

function sendmessage(req, res) {
    var id = req.swagger.params.objmessage.value.objmessage.id;
    var token = req.swagger.params.objmessage.value.objmessage.token;
    var type = req.swagger.params.objmessage.value.objmessage.type;
    var content = req.swagger.params.objmessage.value.objmessage.content;
    var check = checkToken(token);
    if (check.isValid && !check.isExpired) {
        if (type === 'group') {
            get(`group.${id}.lastedmsg`, (err, value) => {
                if (!err) {
                    var newid = parseInt(value) + 1;
                    putSync(`group.${id}.msg.${newid}`, Date.now() + `;${check.user};${content}`);
                    putSync(`group.${id}.lastedmsg`, newid);
                    putSync(`group.${id}.read.${check.user}`, newid);
                }
                else {
                    res.json({ status: 404, message: '404 Not found' });
                }
            });
        }
        else {
            get(`con.${id}.lastedmsg`, (err, value) => {
                if (!err) {
                    var newid = parseInt(value) + 1;
                    putSync(`con.${id}.msg.${newid}`, Date.now() + `;${check.user};${content}`);
                    putSync(`con.${id}.lastedmsg`, newid);
                    putSync(`con.${id}.read.${check.user}`, newid);
                }
                else {
                    res.json({ status: 404, message: '404 Not found' });
                }
            });
        }
        res.json({ status: 200, message: 'Send message successfully' });
    }
    else {
        res.json({ status: 400, message: 'Token is invalid or expired' });
    }
}

function getlastedmsg(req, res) {

    var token = req.swagger.params.token.value;
    var id = req.swagger.params.id.value;
    var type = req.swagger.params.type.value;
    var check = checkToken(token);
    if (check.isValid && !check.isExpired) {
        if (type === 'group') {
            get(`group.${id}.lastedmsg`, (err, value) => {
                if (!err) {
                    res.json({ status: 200, value: value });
                }
                else {
                    res.json({ status: 404, message: '404 Not found' });
                }
            });
        } else {
            get(`con.${id}.lastedmsg`, (err, value) => {
                if (!err) {
                    res.json({ status: 200, value: value });
                }
                else {
                    res.json({ status: 404, message: '404 Not found' });
                }
            });
        }
    }
    else {
        res.json({ status: 400, message: 'Token is invalid or expired' });
    }
}


function updateunread(req, res) {
    var token = req.swagger.params.token.value;
    var id = req.swagger.params.id.value;
    var type = req.swagger.params.type.value;
    var check = checkToken(token);
    if (check.isValid && !check.isExpired) {
        if (type === 'group') {
            get(`group.${id}.lastedmsg`, (err, value) => {
                if (!err) {
                    putSync(`group.${id}.read.${check.user}`, value);
                }
                else {
                    res.json({ status: 404, message: '404 Not found' });
                }
            });
        } else {
            get(`con.${id}.lastedmsg`, (err, value) => {
                if (!err) {
                    putSync(`con.${id}.read.${check.user}`, value);
                }
                else {
                    res.json({ status: 404, message: '404 Not found' });
                }
            });
        }
        res.json({ status: 200, message: 'Update unread successfully' });
    }
    else {
        res.json({ status: 400, message: 'Token is invalid or expired' });
    }
}
