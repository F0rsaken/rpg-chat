<template>
    <div class="chat-input-wrapper">
        <div ref="textarea" class="textarea-wrapper">
            <InputDisplay ref="inputDisplay" :key="refresh"/>
            <ButtonDefault class="send-button" :text="'Send'" @on-click="sendMessage"></ButtonDefault>
        </div>
        <div class="module-buttons-wrapper">
            <button class="btn module-button module-style-1" @click="createModule(1)">Aa</button>
            <button class="btn module-button module-style-2" @click="createModule(2)">Aa</button>
            <button class="btn module-button module-style-3" @click="createModule(3)">Aa</button>
            <button class="btn module-button module-style-4" @click="createModule(4)">Aa</button>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import ButtonDefault from '../../components/ButtonDefault.vue';
import InputDisplay from './InputDisplay';
import { MessagesService } from '../../services/messages-service.js';

const data = {
    refresh: false
};

var selectStarted = false;


export default {
    name: 'ChatInput',
    components: {
        ButtonDefault,
        InputDisplay
    },
    data: () => data,
    methods: {
        refreshDisplay() {
            this.refresh = !this.refresh;
        },
        sendMessage() {
            let msg = this.$refs.inputDisplay.getMessage();
            msg.forEach(el => {
                delete el.start;
                delete el.end;
            });

            MessagesService.sendMessage(msg);
            this.$refs.inputDisplay.clear();
        },

        createModule(moduleId) {
            this.$refs.inputDisplay.createModule(moduleId);
        },

        onEnterPress(event) {
            if (event.charCode !== 13) return;
            
            this.sendMessage();
        },
    },
    created() {}
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/consts.scss';

.chat-input-wrapper {
    margin-top: 30px;
    width: 100%;
    display: flex;
    flex-direction: column;

    .textarea-wrapper {
        width: 100%;
        display: flex;
    }

    .send-button {
        padding: 5px 15px;
        margin-left: 10px;
        height: 0%;
        align-self: center;
        border-radius: 10px;
    }

    .module-buttons-wrapper {
        margin-top: 15px;
        height: 40px;

        .module-button {
            padding: 5px 15px;
            border-radius: 20px;
            border: 1px solid $color-2;
            margin-right: 10px;
            height: 100%;
        }

        .module-style-1 { font-family: "Courier New"; font-style: italic; }
        .module-style-2 { font-weight: bold; }
        .module-style-3 { background-color: rgba(17, 226, 17, 0.849); color: #000000; font-family: "Courier New"; }
        .module-style-4 {
            background: #05abe0;
            background: -moz-radial-gradient(center, ellipse cover, #05abe0 0%, #53cbf1 56%, #87e0fd 100%);
            background: -webkit-radial-gradient(center, ellipse cover, #05abe0 0%,#53cbf1 56%,#87e0fd 100%);
            background: radial-gradient(ellipse at center, #05abe0 0%,#53cbf1 56%,#87e0fd 100%);
            filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#05abe0', endColorstr='#87e0fd',GradientType=1 );
        }
    }
}
</style>