import { Moment } from "moment";
import { Subscription, Subject } from "rxjs";

declare global {
    namespace Messages {
        export interface MessagesService {
            _allMessages: Message[];
            _subject: Subject<Message>;
    
            getMessages(): Message[];
            getMessageSubject(): Subject<Message>;
            connect(address: string): Promise<boolean>;
            sendMessage(target: string, message: string): boolean;
            _addMessage(msg: Message): void;
            disconnect(): void;
        }
    
        export interface Message {
            text: string;
            from: { id: number; name: string; };
            time: Moment;
        } 
    }
}

// export declare namespace Messages {
//     export interface MessagesService {
//         _allMessages: Message[];
//         _ircClient: any;
//         _subject: Subject<Message>;

//         getMessages(): Message[];
//         getMessageSubject(): Subject<Message>;
//         connect(address: string, nick: string, password: string): Promise<boolean>;
//         sendMessage(target: string, message: string): boolean;
//         _addMessage(msg: Message): void;
//         disconnect(): void;
//     }

//     export interface Message {
//         text: string;
//         sendBy: (string | number);
//         sendTime: Moment;
//         receivedTime: Moment;
//     } 
// }