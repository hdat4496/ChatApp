'use strict';
const { get, putSync } = require('../helpers/db');
const { checkToken } = require('../helpers/token');
// const { runData } = require('../helpers/data.js')
module.exports = {
    creategroup: creategroup,
    getlastedgroup: getlastedgroup,
    addmember: addmember,

};
function creategroup(req, res) {
    var objgroup = req.swagger.params.objgroup.value.objgroup.conobj;
    var token = req.swagger.params.objgroup.value.objgroup.token;
    var check = checkToken(token);
    if (check.isValid && !check.isExpired) {
        if(typeof objgroup !=="undefined" &&  objgroup.username !=="" &&  objgroup.groupname !=="" && /^[a-zA-Z0-9]*$/.test(objgroup.groupname)){
        get(`group.lastedid`, (err, value) => {
            if (!err) {
                var newId = parseInt(value) + 1;
                putSync('group.lastedid', newId);
                putSync(`group.${newId}`, objgroup.groupname);
                putSync(`group.${newId}.user`, `${objgroup.username}`);
                putSync(`group.${newId}.lastedmsg`, 0);
                var listmember = objgroup.username.split(";");
                listmember.map((e) => {
                    putSync(`group.${newId}.read.${e}`, 0);
                    get(`u.${e}.groups`, (err, value) => {
                        if (!err) {
                            putSync(`u.${e}.groups`, value !== '' ? `${value};${newId}` : `${newId}`);
                        }
                        else {
                            res.json({ status: 404, message: '404 Not found' });
                        }
                    });
                })
                res.json({ status: 200, message: 'Create group successful!' });
            }
            else {
                res.json({ status: 404, message: '404 Not found' });
            }
        });
    } else {
        res.json({ status: 400, message: 'Groupname and member is require' });
    }

    }
    else {
        res.json({ status: 400, message: 'Token is invalid or expired' });
    }
}

function getlastedgroup(req, res) {
    var token = req.swagger.params.token.value;
    var check = checkToken(token);
    if (check.isValid && !check.isExpired) {
        get(`group.lastedid`, (err, value) => {
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

function addmember(req, res) {
    var groupId = req.swagger.params.obj.value.obj.groupId;
    var member = req.swagger.params.obj.value.obj.member;
    var listmember = member.split(';');
    var token = req.swagger.params.obj.value.obj.token;
    var check = checkToken(token);
    if (check.isValid && !check.isExpired) {
        get(`group.${groupId}.user`, (err, value) => {
            if (!err) {
                putSync(`group.${groupId}.user`, `${value};${member}`);
            }
            else {
                res.json({ status: 404, message: '404 Not found' });
            }

        });
        var lastedmsg = 0;
        get(`group.${groupId}.lastedmsg`, (err, value) => {
            if (!err) {
                lastedmsg = value;
                listmember.map((e) => {
                    get(`u.${e}.groups`, (err, value) => {
                        if (!err) {
                            putSync(`u.${e}.groups`, value === '' ? `${groupId}` : `${value};${groupId}`);
                        }
                        else {
                            res.json({ status: 404, message: '404 Not found' });
                        }
                    });
                    putSync(`group.${groupId}.read.${e}`, lastedmsg);
                });
            }
            else {
                res.json({ status: 404, message: '404 Not found' });
            }
        });
        res.json({ status: 200, message: 'Add member to group successful' });
    }
    else {
        res.json({ status: 400, message: 'Token is invalid or expired' });
    }
}


