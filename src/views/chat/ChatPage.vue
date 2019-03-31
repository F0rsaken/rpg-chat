<template>

    <div class="chat-wrapper">
        <div class="row">
            <div class="col-8 left-panel">
                <Messages></Messages>
                <ChatInput></ChatInput>
            </div>
            <div class="col-4 right-panel">
                <div class="content">
                    <p>ChatPage!</p>
                    <p>A right side panel place!</p>
                    <ButtonDefault :text="'Logout'" @on-click="onLogout"></ButtonDefault>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import ButtonDefault from '../../components/ButtonDefault.vue';
import ChatInput from './ChatInput.vue';
import Messages from './Messages.vue';
import { mapActions } from 'vuex';

export default {
    name: 'ChatPage',
    components: {
        ButtonDefault,
        ChatInput,
        Messages
    },
    methods: {
        ...mapActions('auth', {
            logout: 'logout'
        }),
        onLogout() {
            this.logout();
            this.$router.push({ name: 'login' });
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/consts.scss';

.chat-wrapper {
    width: 100%;
    // padding: 30px 20px;
    padding: 0px 20px;

    .row, .right-panel { height: 100%; }
    .left-panel, .right-panel { margin-top: 0; margin-bottom: 0; position: relative; }

    .row { display: flex; flex-direction: row; }

    .right-panel {
        margin: 0;
        display: flex;
        .content {
            padding: 30px 20px;
            border-left: 1px solid $color-2;
            width: 100%;
        }
    }

    .left-panel { margin-top: 30px; margin-bottom: 30px; display: flex; }
}
</style>