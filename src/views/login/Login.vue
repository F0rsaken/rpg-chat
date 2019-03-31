<template>
    <div class="login-panel">
        <img alt="Vue logo" src="../../assets/logo.png" style="max-width: 185px;">
        <h2>Welcome<br>adventurer</h2>
        <div class="form-wrapper">
            <InputForm :label="'URL'" v-model="url"/>
            <InputForm :type="'login'" :label="'Login'" v-model="login"/>
            <InputForm :type="'password'" :label="'Password'" v-model="password"/>
        </div>
        <ButtonDefault class="login-button" :text="'Login'" @on-click="onLogin"/>
    </div>
</template>

<script>
import InputForm from '../../components/InputForm.vue'
import ButtonDefault from '../../components/ButtonDefault.vue'
import { mapState, mapActions } from 'vuex';

const data = {
    login: '',
    password: '',
    url: ''
};

export default {
    components: {
        InputForm,
        ButtonDefault
    },
    name: 'Login',
    computed: mapState('auth', {
        authenticated: 'authenticated',
    }),
    data: () => data,
    methods: {
        onLogin() {
            this.loginAction({ login: this.login, password: this.password, url: this.url }).then(verified => {
                if (verified) {
                    this.$router.push({ name: 'chat' })
                } else {
                    console.error('Auth didn\'t success');
                }
            })
        },
        ...mapActions('auth', {
            loginAction: 'login'
        })
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
    }

    .login-button { margin-top: 20px; }
}
</style>