import Vue from "vue";
import Vuex from "vuex";
import { auth } from './auth/auth';
import { chatRoom } from './chat-room/chat-room';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        version: '0.0.1',
        api_address: ''
    },
    mutations: {
        apiChange(state, payload) {
            state.api_address = payload.api;
        }
    },
    actions: {
        setApiAddress({ commit }, payload) {
            commit('apiChange', payload);
        }
    },
    modules: {
        auth,
        chatRoom
    }
});

// export type RootState = { version: string }