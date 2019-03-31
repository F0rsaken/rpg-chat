import Vue from "vue";
import Vuex from "vuex";
import { auth } from './auth/auth';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        version: '0.0.1'
    },
    modules: {
        auth
    }
});

// export type RootState = { version: string }