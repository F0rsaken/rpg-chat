import ApiMethods from "../../services/api-methods";
import to from 'await-to-js';

export const auth = {
    namespaced: true,
    state: {
        webSocketAddress: '',
        authenticated: false,
        logging: false,
        userId: null
    },
    mutations: {
        logging(state) {
            state.logging = true;
        },
        userAuthenticated(state, payload) {
            state.logging = false;
            state.authenticated = true;
            state.userId = payload.id;
        },
        userUnauthorized(state) {
            state.logging = false;
            state.authenticated = false;
        },
        userLogout(state) {
            state.authenticated = false;
            state.userId = null;
        },
        changeWSAddress(state, payload) {
            state.webSocketAddress = payload.ws;
        }
    },
    actions: {
        async login({ commit, state }, payload) {
            commit('logging');
            let res, err;
            [err, res] = await to(ApiMethods.login(payload.nick));

            if (err) {
                commit('userUnauthorized');
                throw err;
            }
            let user = res.data;
            if (state.authenticated) user.id = state.userId;

            [err, res] = await to(ApiMethods.connect('Test', 'admin', user.id, user.token));

            if (err) {
                commit('userUnauthorized');
                throw err;
            }

            commit('userAuthenticated', { id: user.id });
            commit('changeWSAddress', { ws: res.data.address });
            return res.data;
        },
        logout({ commit }) {
            // MessagesService.disconnect();
            commit('userLogout');
        }
    }
}

// export type AuthState = {
//     authenticated: boolean,
//     logging: boolean,
//     userId: number | null
// }

// export type AuthPayload = {
//     url: string,
//     login: string,
//     password: string
// }