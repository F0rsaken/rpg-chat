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
        userLogout(state) {
            state.authenticated = false;
        }
    },
    actions: {
        login({ commit }, payload) {
            commit('logging', payload);
            return new Promise( (resolve, reject) => {
                MessagesService.connect(payload['addres'], payload['nick'], null);
                commit('userAuthenticated');
                // setTimeout(() => {
                //     resolve(true);
                // }, 500);
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