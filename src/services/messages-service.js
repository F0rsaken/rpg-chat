import moment from 'moment';
import { Subject } from 'rxjs';
// import WebSocket from 'ws';
import store from '../store/store';

class _MessagesService {
    /** @type {Messages.Message[]} */
    _allMessages = [];
    /** @type {Subject} */
    _subject;
    /** @type {WebSocket} */
    _ws;

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


    connect(wsAddress) {
        // const ws = new WebSocket(wsAddress);
        console.log(wsAddress);
        const ws = new WebSocket(wsAddress + `?id=${store.state.auth.userId}`);
        ws.onopen = () => {
            console.log('opened!');
        }

        ws.onmessage = (ev) => {
            let msg = JSON.parse(ev.data);
            if (msg.type === MSG_TYPES.clientJoin) {
                store.dispatch('chatRoom/addUser', { user: msg.user});
            } else if (msg.type === MSG_TYPES.clientLeft) {

            } else {
                this._addMessage(msg);
            }
        }

        ws.onerror = (ev) => {
            console.log('Error!');
            console.log(ev);
        }

        this._ws = ws;
    }

    sendMessage(message) {
        if (!this._ws) {
            console.error('Error! Client not connected!');
            return false;
        }

        let msgObj = { message, from: { id: store.state.auth.userId }, time: moment() }

        this._ws.send(JSON.stringify({ type: MSG_TYPES.message, ...msgObj }))
        this._addMessage({ ...msgObj });
        return true;
    }

    /** @param {Messages.Message} msg */
    _addMessage(msg) {
        this._allMesseges.push(msg);
        this._subject.next(msg);
    }

    disconnect() {
        if (this._ws) {
            this._ws.close();
        }
    }
}

// /** @type {Messages.MessagesService} */
export const MessagesService = new _MessagesService();

const MSG_TYPES = {
    clientJoin: 0,
    clientLeft: 1,
    message: 2
}

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