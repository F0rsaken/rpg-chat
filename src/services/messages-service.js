import moment from 'moment';
import { Observable, Subscription } from 'rxjs';
// import { Message } from './types';

import irc from 'irc';

export default new class MessagesService {
    /** @type {Message} */
    _allMesseges = [];
    /** @type {Observable} */
    _subscription;
    _ircClient;

    constructor() {
        this._allMesseges = [
            { text: 'Testowa wiadomość, a co! 1', sendBy: 0 },
            { text: 'Testowa wiadomość, a co! 2', sendBy: 0 },
            { text: 'Testowa wiadomość, a co! 3', sendBy: 2 },
            { text: 'Testowa wiadomość, a co! 4', sendBy: 2 },
            { text: 'Testowa wiadomość, a co! 5', sendBy: 0 },
            { text: 'Testowa wiadomość, a co! 6', sendBy: 2 },
            { text: 'Testowa wiadomość, a co! 7', sendBy: 0 },
            { text: 'Testowa wiadomość, a co! 8', sendBy: 2 },
            { text: 'Testowa wiadomość, a co! 9', sendBy: 0 },
            { text: 'Testowa wiadomość, a co! 10', sendBy: 0 },
            { text: 'Lorem ipsum itp', sendBy: 2 }
        ];

        this._subscription = Observable.create((observer) => {
            try {
                let index = 0;
                let interval = setInterval(() => {  
                    this._allMesseges[index].receivedTime = moment();
                    observer.next({...this._allMesseges[index]});
                    index++;
                    if (index === this._allMesseges.length) {
                        clearInterval(interval);
                        observer.complete();
                    }
                }, 500);
            } catch(err) {
                observer.error(err);
            }
        })
    }

    /** @returns {Message[]} */
    getMessages() {
        return this._allMesseges.slice();
    }

    /** @returns {Subscription} */
    getMessageSubscription() {
        return this._subscription;
    }

    // IRC JS docs https://node-irc.readthedocs.io/en/latest/API.html#client
    connect(addres, nick, password) {
        let client = new irc.Client(addres, nick, {
            channels: ['#testchannel']
        });

        client.addListener('registered', (message) => {
            console.log(message);
        });

        client.addListener('message', (from, to, message) => {
            console.log('from', from);
            console.log('to', to);
            console.log('message', message);
        });

        client.addListener('error', () => {
            console.log('Error!');
        });

        this._ircClient = client;
    }

    /** @returns {Boolean} if sending succeded */
    sendMessage(target, message) {
        if (!this._ircClient) {
            console.error('Error! Client not connected!');
            return false;
        }
        console.log('Send', this._ircClient.say(target, message));
        return true;
    }

    disconnect() {
        if (this._ircClient) {
            this._ircClient.disconnect();
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