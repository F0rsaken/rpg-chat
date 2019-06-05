<template>

    <div class="chat-wrapper">
        <div class="row">
            <div class="col-9 left-panel">
                <Messages></Messages>
                <ChatInput></ChatInput>
            </div>
            <div class="right-panel">
                <div class="content">
                    <ButtonDefault class="btn-logout" :text="'Logout'" @on-click="onLogout"></ButtonDefault>
                    <div class="current-users">
                        <h4>Logged in users!</h4>
                        <p class="single-user" v-for="user in users" :key="user.id">{{ user.name }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import ButtonDefault from '../../components/ButtonDefault.vue';
import ChatInput from './ChatInput.vue';
import Messages from './Messages.vue';
import { mapActions, mapState } from 'vuex';
import { MessagesService } from '../../services/messages-service';

export default {
    name: 'ChatPage',
    components: {
        ButtonDefault,
        ChatInput,
        Messages
    },
    computed: {
        ...mapState('auth', {
            wsAddress: 'webSocketAddress'
        }),
        ...mapState('chatRoom', {
            users: 'users'
        })
    },
    methods: {
        ...mapActions('auth', {
            logout: 'logout'
        }),
        ...mapActions('chatRoom', {
            fetchData: 'fetchData'
        }),
        onLogout() {
            this.logout().then(() => {
                this.$router.push({ name: 'login' });
            });
        }
    },
    created() {
        if (this.wsAddress === '') {
            this.$router.push({ name: 'login' });
            return;
        }

        MessagesService.connect(this.wsAddress);
        this.fetchData();
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
        flex: 1;

        .content {
            padding: 30px 20px;
            border-left: 1px solid $color-2;
            width: 100%;
            display: flex;
            flex-direction: column;

            .btn-logout { margin: 0 auto; }

            .current-users {
                display: flex;
                flex-direction: column;
                margin-top: 20px;
                h4 { margin: 0 0 10px; padding-bottom: 5px; border-bottom: 1px solid $color-1; }

                .single-user { margin: 5px 0; padding: 5px 0 5px 10px; width: 100%; text-align: left; }
            }
        }
    }

    .left-panel { margin-top: 30px; margin-bottom: 30px; display: flex; flex-direction: column; max-height: calc(100vh - 60px); }
}
</style>