import moment from 'moment';

// /**
//  * @typedef Message
//  * 
//  */
// /**
//  * @typedef Message
//  * @type {object}
//  * @property {string} text
//  * @property {string | number} sendBy
//  * @property {Moment} [sendTime]
//  * @property {Moment} [recievedTime]
//  */

export interface Message {
    text: string;
    sendBy: (string | number);
    sendTime?: moment.Moment;
    receiveTime?: moment.Moment;
}