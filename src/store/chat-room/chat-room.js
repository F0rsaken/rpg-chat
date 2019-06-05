import ApiMethods from '../../services/api-methods';

export const chatRoom = {
    namespaced: true,
    state: {
        users: [],
        messages: [],
        roomId: null
    },
    mutations: {
        setRoomId(state, roomId) {
            state.roomId = roomId;
        },
        updateData(state, payload) {
            state.users = payload.currentUsers;
            state.messages = [...payload.messages];
        },
        addMessage(state, message) {
            state.messages.push(message);
        },
        addUser(state, payload) {
            state.users.push(payload.user);
        }
    },
    actions: {
        setRoomId({ commit }, roomId) {
            commit('setRoomId', roomId);
        },
        fetchData({ commit, state }) {
            ApiMethods.roomDetails(state.roomId).then(data => {
                let { currentUsers, messages } = data.data;
                commit('updateData', { currentUsers, messages });
            }).catch(err => {
                console.log(err);
            })
        },
        addMessage({ commit }, message) {
            commit('addMessage', message);
        },
        addUser({ commit }, payload) {
            commit('addUser', payload);
        }
    },
    getters: {
        reversedMessages(state) {
            // console.log(state.messages);
            return state.messages.slice().reverse();
        }
    }
}