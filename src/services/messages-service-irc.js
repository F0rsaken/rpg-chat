import moment from 'moment';
import { Subject } from 'rxjs';

const irc = require('slate-irc');
const net = require('net');

class _MessagesService {
    /** @type {Messages.Message[]} */
    _allMessages = [];
    /** @type {Subject} */
    _subject;
    /** @type {irc.Client} */
    _ircClient;

    constructor() {
        this._allMesseges = [];
        this._subject = new Subject();
    }

    getMessages() {
        return this._allMesseges.slice();
    }

    getMessageSubject() {
        return this._subject;
    }

    // IRC JS docs https://node-irc.readthedocs.io/en/latest/API.html#client
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

    sendMessage(target, message) {
        if (!this._ircClient) {
            console.error('Error! Client not connected!');
            return false;
        }
        this._ircClient.send(target, message);
        this._addMessage({ text: message, sendBy: 0, sendTime: moment() });
        return true;
    }

    _addMessage(msg) {
        this._allMesseges.push(msg);
        this._subject.next(msg);
    }

    disconnect() {
        if (this._ircClient) {
            this._ircClient.quit('quit');
        }
    }
}

/** @type {Messages.MessagesService} */
export const MessagesService = new _MessagesService();
// export service;

/*
// var s = "Ala ma kota"
// for(var i=0; i<s.length; i++){
//     process.stdout.write(s.charAt(i));
// }
// process.stdout.write("\n");

var s2 = "[[ font:arial, color:red ]] asadasdasda \
\
[[ delay:5 ]]\
\
adasdadsasd [[ color:blue ]]\
sdgsgdgf[] hjhkhkjhjkh[\
sdfdf"

var arr = []
var str = ""
var id = 0
var pos = 0

for(var i=0; i<s2.length; i++){
    str += s2.charAt(i);
    console.log(str);
    if(s2.charAt(i) === "[" && s2.charAt(i+1) === "["){
        pos = i-2
        arr[id] = s2.substring(pos, i-2);
        id++;
        i++;
        str = "[[";
        var cnt = 2;
        while(cnt > 0){
            var ch = s2.charAt(i);
            console.log(ch);
            if(ch === "]"){ cnt-- }
            if(ch === "["){ cnt++ }
            str += ch
            i++
        }
        arr[id] = str;
        str = "";
        id++;
        pos = i;
    }
}

console.log("result");
for(var i = 0; i<arr.length; i++){
    console.log(arr[i])
}


TODO:

"default_conf = { //assume its json
	color: black,
	font: arial,
	size: 12,
	effects = []
}

parsowanie:

dostajemy string
tworzymy roboczą kopię konfiguracji startowej
dzielimy string na text/polecenia tworząc krotki:
	jeśli przed tekstem pojawiło się polecenie, nadpisujemy nim roboczą konfigurację
	pobieramy text po nim, robimy krotkę (konfiguracja, text)

teraz za każdym razem jak pojawi się nowe polecenie nadpisujemy roboczą
w przypadku chęci resetu nadpisujemy ją konfiguracją startową
"


*/