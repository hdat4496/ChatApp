"use strict";
const http = require('http');
const SocketServer = require('websocket').server;
const { checkToken } = require('../helpers/token');
const { get } = require('../helpers/db');
const port = 10000;

var clients = [];
var useronline = [];

var server = http.createServer();
server.listen(port, function () {
    console.log("[SOCKET] - Server is listening on port " + port);
});

var wsServer = new SocketServer({ httpServer: server });
wsServer.on('request', function (request) {
    console.log('[SOCKET] - Connection from origin ' + request.origin + '.');
    var connection = request.accept(null, request.origin);
    console.log('[SOCKET] - Connection accepted.');
    var user;
    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            var res = JSON.parse(message.utf8Data);
            var check = checkToken(res.token);
            if (check.isValid && !check.isExpired) {
                switch (res.type) {
                    case 'CONNECT':
                        user = check.user;
                        var keys = Object.keys(clients);
                        keys.map((e) => {
                            clients[e].sendUTF(JSON.stringify({
                                type: 'NEWONLINE',
                                data: check.user
                            }));
                        })
                        clients[user] = connection;
                        useronline.push(user);
                        console.log(`[SOCKET] - [${user}] connected.`);
                        connection.sendUTF(JSON.stringify({
                            type: 'USERONLINE',
                            data: useronline
                        }));
                        break;
                    case 'SETSTATUS':
                    console.log('5555555555555555555');
                        user = check.user;
                        var status = res.status;

                        var keys = Object.keys(clients);
                        keys.map((e) => {
                            clients[e].sendUTF(JSON.stringify({
                                type: 'SETSTATUS',
                                data: status,
                                userchange: user
                            }));
                        });
                        break;
                    case 'SEND_MESSAGE':
                        var listmessage = [];
                        var lastmessage = {};
                        var groupname = ''
                        if (res.type_group_con === 'group') {
                            get(`group.${res.id}`, (err, value) => {
                                if (!err) {
                                    groupname = value;
                                    get(`group.${res.id}.lastedmsg`, (err, value) => {
                                        if (!err) {
                                            var numbermessage = parseInt(value);
                                            var getMessage = (i, callback) => {
                                                if (i > numbermessage) {
                                                    callback();
                                                    return;
                                                }
                                                get(`group.${res.id}.msg.${i}`, (err, value) => {
                                                    if (!err) {
                                                        var objmessage = value.split(';');
                                                        lastmessage = {
                                                            id: parseInt(i),
                                                            username: objmessage[1],
                                                            content: objmessage[2],
                                                            time: parseInt(objmessage[0])
                                                        };
                                                        listmessage.push(lastmessage);
                                                        getMessage(i + 1, callback);
                                                    }
                                                })
                                            }
                                            getMessage(1, () => {
                                                get(`group.${res.id}.user`, (err, value) => {
                                                    if (!err) {
                                                        var response = {
                                                            type: 'SEND_MESSAGE',
                                                            listmessage: listmessage,
                                                            type_con_group: res.type_group_con,
                                                            id: res.id,
                                                            lastedmsg: lastmessage,
                                                            usersend: check.user,
                                                            groupname: groupname,
                                                            username:value,
                                                        };
                                                        var listuser = value.split(';');
                                                        listuser.map((e, i) => {
                                                            if (clients[e] != null) {
                                                                console.log(`[SOCKET] - Send message to [${e}]`);
                                                                clients[e].sendUTF(JSON.stringify(response));
                                                            }
                                                        })
                                                    }
                                                });

                                            });

                                        }
                                    });
                                }
                            });
                        }
                        else {
                            
                            get(`con.${res.id}.lastedmsg`, (err, value) => {
                                if (!err) {
                                    var numbermessage = parseInt(value);
                                    var getMessage = (i, callback) => {
                                        if (i > numbermessage) {
                                            callback();
                                            return;
                                        }
                                        get(`con.${res.id}.msg.${i}`, (err, value) => {
                                            var objmessage = value.split(';');
                                            lastmessage = {
                                                id: parseInt(i),
                                                username: objmessage[1],
                                                content: objmessage[2],
                                                time: parseInt(objmessage[0])
                                            };
                                            listmessage.push(lastmessage);
                                            getMessage(i + 1, callback);
                                        })
                                    }

                                    getMessage(1, () => {
                                        var response = {
                                            type: 'SEND_MESSAGE',
                                            listmessage: listmessage,
                                            type_con_group: res.type_group_con,
                                            id: res.id,
                                            lastedmsg: lastmessage,
                                            usersend: check.user,
                                            groupname: groupname,
                                            username: check.user
                                        };
                                        get(`con.${res.id}.user`, (err, value) => {
                                            if (!err) {
                                                var listuser = value.split(';');
                                                listuser.map((e, i) => {
                                                    if (clients[e] != null) {
                                                        clients[e].sendUTF(JSON.stringify(response));
                                                    }
                                                })
                                            }
                                        });

                                    });

                                }
                            });
                        }

                        break;
                    default:
                        break;
                }
            } else {
                connection.sendUTF(JSON.stringify({
                    type: 'RESPONSE',
                    message: 'Token is not valid or expired'
                }));
            }
        }
    });

    connection.on('close', function (connection) {
        console.log(`[${user}] closed connection.`);
        delete clients[user];
        var index = useronline.indexOf(user);
        if (index > -1) {
            useronline.splice(index, 1);
        }

        var keys = Object.keys(clients);
        keys.map((e) => {
            clients[e].sendUTF(JSON.stringify({
                type: 'USERONLINE',
                data: useronline
            }));
        })


    });
});