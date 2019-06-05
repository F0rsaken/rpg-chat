import axios from 'axios';
import store from '../store/store';

// const API_ADDRESS = 'http://localhost:4500'

export default new class API_MTEHODS {
    get API_ADDRESS() {
        return store.state.api_address
    }

    login(nick) {
        return axios.get(`${this.API_ADDRESS}/login`, { params: { name: nick } });
    }

    connect(roomName, password, userId, token) {
        return axios.post(`${this.API_ADDRESS}/chat-rooms/connect`, { roomName, password, userId, token });
    }

    roomDetails(roomId) {
        return axios.get(`${this.API_ADDRESS}/chat-rooms/details/${roomId}`);
    }
}