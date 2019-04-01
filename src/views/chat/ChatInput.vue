<template>
    <div class="chat-input-wrapper">
        <input type="text" v-model="textInput">
        <ButtonDefault class="send-button" :text="'Send'" @on-click="sendMessage"></ButtonDefault>
    </div>
</template>

<script>
import Vue from 'vue';
import ButtonDefault from '../../components/ButtonDefault.vue';
import MessagesService from '../../services/messages-service.js';

const data = {
    textInput: ''
};

export default {
    name: 'ChatInput',
    components: {
        ButtonDefault
    },
    data: () => data,
    methods: {
        sendMessage() {
            MessagesService.sendMessage('#testchannel', this.textInput);
            this.textInput = '';
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/consts.scss';

.chat-input-wrapper {
    position: absolute;
    bottom: 0;
    width: 100%;
    display: flex;

    input {
        width: 100%; box-sizing: border-box; font-size: 15px; padding: 8px 15px; border-radius: 20px;
        // color: #3c3c3c;
        color: $color-2;
        border: 1px solid $color-2;
        background-color: $background-color-1;

        &:focus { outline: none; }
    }

    .send-button {
        border-radius: 20px;
        padding: 0 20px;
        margin-left: 10px;
    }
}
</style>