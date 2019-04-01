import MessagesService from '../../services/messages-service';

export const auth = {
    namespaced: true,
    state: {
        authenticated: false,
        logging: false,
        userId: null
    },
    mutations: {
        logging(state, payload) {
            state.logging = true;
            // console.log('logging', payload);
        },
        userAuthenticated(state) {
            state.logging = false;
            state.authenticated = true;
            state.userId = 0;
        },
        userUnauthorized(state) {
            state.logging = false;
            state.authenticated = false;
        },
        userLogout(state) {
            state.authenticated = false;
            state.userId = null;
        }
    },
    actions: {
        login({ commit }, payload) {
            commit('logging', payload);
            return new Promise( (resolve, reject) => {
                console.log(payload);
                MessagesService.connect(payload['url'], payload['nick'], null).then(() => {
                    console.log('auth finished!');
                    commit('userAuthenticated');
                    resolve(true);
                }).catch(() => {
                    commit('userUnauthorized');
                    reject(false);
                });
            });
        },
        logout({ commit }) {
            MessagesService.disconnect();
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