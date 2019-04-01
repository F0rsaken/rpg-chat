import moment from 'moment';
import { Observable, Subject } from 'rxjs';
// import { Message } from './types';

// import irc from 'node-irc';

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
        this._allMesseges = [
            // { text: 'Testowa wiadomość, a co! 1', sendBy: 0 },
            // { text: 'Testowa wiadomość, a co! 2', sendBy: 0 },
            // { text: 'Testowa wiadomość, a co! 3', sendBy: 2 },
            // { text: 'Testowa wiadomość, a co! 4', sendBy: 2 },
            // { text: 'Testowa wiadomość, a co! 5', sendBy: 0 },
            // { text: 'Testowa wiadomość, a co! 6', sendBy: 2 },
            // { text: 'Testowa wiadomość, a co! 7', sendBy: 0 },
            // { text: 'Testowa wiadomość, a co! 8', sendBy: 2 },
            // { text: 'Testowa wiadomość, a co! 9', sendBy: 0 },
            // { text: 'Testowa wiadomość, a co! 10', sendBy: 0 },
            // { text: 'Lorem ipsum itp', sendBy: 2 }
        ];

        this._subject = new Subject();

        // this._subscription = of(this._allMesseges);
        // this._subscription = Observable.create((observer) => {
        //     try {
        //         // let index = 0;
        //         // let interval = setInterval(() => {  
        //         //     this._allMesseges[index].receivedTime = moment();
        //         //     observer.next({...this._allMesseges[index]});
        //         //     index++;
        //         //     if (index === this._allMesseges.length) {
        //         //         clearInterval(interval);
        //         //         observer.complete();
        //         //     }
        //         // }, 500);
        //     } catch(err) {
        //         observer.error(err);
        //     }
        // })
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
        // let client = new irc.Client(addres, nick, {
        //     channels: ['#testchannel']
        // });

        // client.addListener('registered', (message) => {
        //     console.log(message);
        // });

        // client.addListener('message', (from, to, message) => {
        //     console.log('from', from);
        //     console.log('to', to);
        //     console.log('message', message);
        // });

        // client.addListener('error', () => {
        //     console.log('Error!');
        // });

        // this._ircClient = client;

        

        // client.names('#testchannel', (error: any, names: any) => {
        //     console.log('names', names);
        //     console.log('error', error);
        // });

        return new Promise((resolve, reject) => {
            let stream = net.connect({ port: 6667, host: address });
            let client = irc(stream);
            client.nick(nick);
            client.user('majlo', 'My Real Name');
            if (password) client.pass(password);
            client.join('#testchannel');

            client.on('message', (msg) => {
                console.log('message', msg);
                let newMessage = { text: msg.message, sendBy: msg.from, receivedTime: moment() };
                this._addMessage(newMessage);
                // this._subscription = Observable.create( o => {
                //     this._allMesseges.push(msg);
                //     // o.next()
                // });
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