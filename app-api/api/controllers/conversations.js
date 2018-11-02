'use strict';

const { get, putSync } = require('../helpers/db');
const { checkToken } = require('../helpers/token');
// const { runData } = require('../helpers/data.js')
module.exports = {
    createconversation: createconversation,
    getlastedcon:getlastedcon

};

function createconversation(req, res) {
    var objcon = req.swagger.params.objconversations.value.objconversations.conobj;
    var token = req.swagger.params.objconversations.value.objconversations.token;
    var check = checkToken(token);
    if (check.isValid && !check.isExpired) {
        get(`con.lastedid`, (err, value) => {
            if (!err) {
                var newId = parseInt(value) + 1;
                putSync('con.lastedid', newId);
                get(`u.${check.user}.user`, (err, value) => {
                    if (!err) {
                        putSync(`u.${check.user}.user`, value != '' ? `${value};${objcon.username}` : `${objcon.username}`);
                        get(`u.${check.user}.cons`, (err, value) => {
                            if (!err) {
                                putSync(`u.${check.user}.cons`, value != '' ? `${value};${newId}` : `${newId}`);
                                get(`u.${objcon.username}.user`, (err, value) => {
                                    if (!err) {
                                        putSync(`u.${objcon.username}.user`, value != '' ? `${value};${check.user}` : `${check.user}`);
                                        get(`u.${objcon.username}.cons`, (err, value) => {
                                            if (!err) {
                                                putSync(`u.${objcon.username}.cons`, value != '' ? `${value};${newId}` : `${newId}`);
                                                putSync(`con.${newId}.user`, check.user + ';' + objcon.username);
                                                putSync(`con.${newId}.lastedmsg`, 0);
                                                putSync(`con.${newId}.read.${check.user}`, 0);
                                                putSync(`con.${newId}.read.${objcon.username}`, 0);
                                                res.json({ status: 200, message: 'Create conversation successful!' });
                                            }
                                            else {
                                                res.json({ status: 404, message: '404 Not found'});
                                            }
                                        });
                                    }
                                    else {
                                        res.json({ status: 404, message: '404 Not found'});
                                    }
                                });
                            }
                            else {
                                res.json({ status: 404, message: '404 Not found'});
                            }
                        });
                    }
                    else {
                        res.json({ status: 404, message: '404 Not found'});
                    }
                });
            }
            else {
                res.json({ status: 404, message: '404 Not found'});
            }
        });
    }
    else {
        res.json({ status: 400, message: 'Token is invalid or expired' });
    }
}

function getlastedcon(req, res) {
    var token = req.swagger.params.token.value;
    var check = checkToken(token);
    if (check.isValid && !check.isExpired) {
        get(`con.lastedid`, (err, value) => {
            if (!err) {
                res.json({ status: 200, value: value});
            }
            else {
                res.json({ status: 404, message: '404 Not found'});
            }
        });
    }
    else {
        res.json({ status: 400, message: 'Token is invalid or expired' });
    }
}