<template>
    <div class="messages-wrapper">
        <div class="messages-inner-wrapper">
            <div v-for="msg in messages" :key="msg.id"
                class="single-message" :class="{ 'user-message': msg.from.id === userId }">
                <p class="user-name" v-if="msg.from.id !== userId">{{ msg.from.name }}</p>
                <p v-html="getMessageHTML(msg.message)" class="single-message__content">
                    <!-- {{ msg.message }} -->
                </p>
                <p class="single-message__time-span">
                    {{ msg.time | moment }}
                </p>
            </div>
            <div class="message-filler"></div>
        </div>
    </div>
</template>

<script>
import { MessagesService } from '../../services/messages-service';
import { Subscription } from 'rxjs';
import { mapState, mapActions, mapGetters } from 'vuex';

const PARSED_TYPES = {
    text: 0,
    module: 1
}

const data = {
    /** @type {Message[]} */
    // messages: []
};

/** @type {Subscription} */
let messagesObservable;

export default {
    name: 'Messages',
    data: () => data,
    computed: {
        ...mapState('auth', {
            userId: 'userId',
            authenticated: 'authenticated'
        }),
        ...mapGetters('chatRoom', {
            messages: 'reversedMessages'
        })
    },
    methods: {
        ...mapActions('chatRoom', {
            addMessage: 'addMessage'
        }),
        getMessageHTML(msg) {
            let retHTML = '';
            if (typeof msg === "string") return msg;
            for (let el of msg) {
                if (el.type === PARSED_TYPES.text) {
                    retHTML += el.text;
                } else {
                    retHTML += `<span class="module-style-${el.moduleId}" data-module-id="${el.moduleId}">${el.text}</span>\xa0`
                }
            }
            return retHTML;
        }
    },
    created() {
        if (!this.authenticated) console.error('User not authenticated');

        messagesObservable = MessagesService.getMessageSubject().subscribe(message => {
            // this.messages.unshift(message);
            this.addMessage(message);
        }, err => {
            console.log('error', err);
        }, () => {
            console.log('complete');
        });
    },
    destroyed() {
        messagesObservable.unsubscribe();
        this.messages.length = 0;
    }
};

</script>

<style lang="scss" scoped>
@import '@/assets/styles/consts.scss';

.messages-wrapper {
    height: 100%;
    display: flex;
    border-radius: 10px;
    background-color: $background-color-1;

    .messages-inner-wrapper {
        display: flex; flex-direction: column-reverse;
        overflow-y: scroll;
        height: calc(100% - 60px); width: 100%;
        padding: 30px 15px;
        align-items: flex-end;

        .single-message {
            font-size: 14px;
            margin: 0 0 10px 5px;
            max-width: 55%;
            display: flex;
            flex-direction: column;

            &:first-of-type { margin-bottom: 0; }

            .user-name { color: #ececec; font-size: 12px; text-align: right; margin: 0 15px 0 0; }
            .single-message__content {
                display: inline-block; padding: 10px 15px; border-radius: 15px;
                background-color: $background-color-global;
                font-size: 16px;
                margin-bottom: 2px;

                /deep/ .module-style-1 { font-family: "Courier New"; font-style: italic; }
                /deep/ .module-style-2 { font-weight: bold; }
                /deep/ .module-style-3 { background-color: rgba(17, 226, 17, 0.849); color: #000000; font-family: "Courier New"; }
                /deep/ .module-style-4 {
                    border-radius: 4px;
                    padding: 0 2px;
                    background: #05abe0;
                    background: -moz-radial-gradient(center, ellipse cover, #05abe0 0%, #53cbf1 56%, #87e0fd 100%);
                    background: -webkit-radial-gradient(center, ellipse cover, #05abe0 0%,#53cbf1 56%,#87e0fd 100%);
                    background: radial-gradient(ellipse at center, #05abe0 0%,#53cbf1 56%,#87e0fd 100%);
                    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#05abe0', endColorstr='#87e0fd',GradientType=1 );
                }
            }
            .single-message__time-span {
                font-size: 12px;
                color: #a7a7a7;
                text-align: right;
                margin: 0 15px 0 0;
            }

            &.user-message {
                align-self: flex-start;

                .single-message__content { border: 2px solid $color-1; }
                .single-message__time-span { text-align: left; margin: 0 0 0 15px; }
            }
        }
        .message-filler { margin-bottom: 40px; width: 100%; }
    }
}
</style>