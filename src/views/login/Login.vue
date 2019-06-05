<template>
    <div class="login-panel">
        <img alt="Vue logo" src="../../assets/logo.png" style="max-width: 185px;">
        <h2>Welcome<br>adventurer</h2>
        <div class="form-wrapper">
            <!-- <InputForm :textAlign="'center'" :label="'URL'" v-model="url"/> -->
            <InputForm :textAlign="'center'" :type="'login'" :label="'Nick'" v-model="nick"/>
            <!-- <InputForm :textAlign="'center'" :type="'password'" :label="'Password'" v-model="password"/> -->
        </div>
        <ButtonDefault class="login-button" :disabled="btnDisabled" :text="'Login'" @on-click="onLogin"/>
    </div>
</template>

<script>
import InputForm from '../../components/InputForm.vue'
import ButtonDefault from '../../components/ButtonDefault.vue'
import { mapState, mapActions } from 'vuex';
import axios from 'axios';
import to from 'await-to-js';

const data = {
    nick: '',
    password: '',
    url: 'arkadianclockwork.ddns.net'
};

export default {
    components: {
        InputForm,
        ButtonDefault
    },
    name: 'Login',
    computed: {
        ...mapState('auth', {
            authenticated: 'authenticated',
            logging: 'logging'
        }),
        btnDisabled() {
            return !(this.nick && this.url && (!this.logging));
        },
    },
    data: () => data,
    methods: {
        onLogin() {
            this.loginAction({ nick: this.nick }).then(res => {
                this.setRoomId(res.roomId);
                this.$router.push({ name: 'chat' })
            }).catch(error => {
                console.log('Error logging user!');
                console.log(error);
            });
        },
        ...mapActions('auth', {
            loginAction: 'login'
        }),
        ...mapActions('chatRoom', {
            setRoomId: 'setRoomId'
        }),
        ...mapActions({
            setApi: 'setApiAddress'
        })
    },
    created() {
        this.setApi({ api: 'http://localhost:4500' });
    }
}

</script>

<style lang="scss" scoped>
@import '@/assets/styles/consts.scss';

.login-panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    top: 50%;
    width: fit-content;
    min-width: 350px;
    margin: 0 auto;
    padding: 40px;
    transform: translateY(-50%);
    background-color: #3a3a3a;
    border-radius: 25px;
    border: 2px solid $color-1;

    h2 { text-align: center; text-transform: uppercase; font-size: 28px; }
    .form-wrapper {
        width: 100%; display: flex; align-items: center; flex-direction: column;
        input { text-align: center; }
    }

    .login-button {
        margin-top: 20px;
        &:disabled { opacity: 0.5; cursor: default; }
    }
}
</style>