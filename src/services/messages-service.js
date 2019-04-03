import moment from 'moment';
import { Observable, Subject } from 'rxjs';

const irc = require('slate-irc');
const net = require('net');


export default new class MessagesService {
    /** @type {Message[]} */
    _allMesseges = [];
    /** @type {Observable} */
    _subscription;
    /** @type {IRC.Client} */
    _ircClient;

    constructor() {
        this._allMesseges = [];

        this._subject = new Subject();
    }

    /** @returns {Message[]} */
    getMessages() {
        return this._allMesseges.slice();
    }

    /** @returns {Subject} */
    getMessageSubject() {
        return this._subject;
    }

    // IRC JS docs https://node-irc.readthedocs.io/en/latest/API.html#client
    /** @returns {Promise<Boolean>} */
    connect(address, nick, password) {

        return new Promise((resolve, reject) => {
            let stream = net.connect({ port: 6667, host: address });
            let client = irc(stream);
            client.nick(nick);
            client.user('majlo', 'My Real Name');
            if (password) client.pass(password);
            client.join('#testchannel');

            // let newMessage = { test: 'test' };
            client.on('message', (msg) => {
                console.log('message', msg);
                let newMessage = { text: msg.message, sendBy: msg.from, receivedTime: moment() };
                this._addMessage(newMessage);
            });

            client.on('data', (msg) => {
                console.log('data', msg);
            });

            client.on('join', (msg) => {
                console.log('join', msg);
                if (msg.nick === nick) {
                    client.on('join', (msg) => {
                        console.log('New client!', msg);
                    });
                    resolve(true);
                } else {
                    console.log('another client', msg);
                }
            });

            this._ircClient = client;
        });
    }

    /** @returns {Boolean} if sending succeded */
    sendMessage(target, message) {
        if (!this._ircClient) {
            console.error('Error! Client not connected!');
            return false;
        }
        this._ircClient.send(target, message);
        this._addMessage({ text: message, sendBy: 0, sendTime: moment() });
        return true;
    }

    /** @param {Message} msg*/
    _addMessage(msg) {
        this._allMesseges.push(msg);
        this._subject.next(msg);
    }

    disconnect() {
        if (this._ircClient) {
            this._ircClient.quit();
        }
    }
}

/**
 * @typedef Message
 * @type {object}
 * @property {string} text
 * @property {string | number} sendBy
 * @property {Moment} [sendTime]
 * @property {Moment} [receivedTime]
 */