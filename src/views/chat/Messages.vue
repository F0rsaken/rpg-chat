<template>
    <div class="messages-wrapper">
        <div class="messages-inner-wrapper">
            <!-- <div v-for="message in messages" class="single-message"></div> -->
            <div v-for="message in messages" :key="message.id"
                class="single-message" :class="{ 'user-message': message.sendBy === userId }">
                <p class="single-message__content">
                    {{ message.text }}
                </p>
            </div>
            <!-- <div class="single-message">TEST</div>
            <div class="single-message">DŁUGI TEST</div>
            <div class="single-message">eli, mordeczki, co tam, joł, dobry, Lorem ipsum itp ite de, jak to mówią, carpe diem, czy coś</div>
            <div class="single-message">TEST</div>
            <div class="single-message">DŁUGI TEST</div>
            <div class="single-message">eli, mordeczki, co tam, joł, dobry, Lorem ipsum itp ite de, jak to mówią, carpe diem, czy coś</div>
            <div class="single-message">TEST</div>
            <div class="single-message">DŁUGI TEST</div>
            <div class="single-message">eli, mordeczki, co tam, joł, dobry, Lorem ipsum itp ite de, jak to mówią, carpe diem, czy coś</div>
            <div class="single-message">TEST</div>
            <div class="single-message">DŁUGI TEST</div>
            <div class="single-message">eli, mordeczki, co tam, joł, dobry, Lorem ipsum itp ite de, jak to mówią, carpe diem, czy coś</div>
            <div class="single-message">TEST</div>
            <div class="single-message">DŁUGI TEST</div>
            <div class="single-message">eli, mordeczki, co tam, joł, dobry, Lorem ipsum itp ite de, jak to mówią, carpe diem, czy coś</div> -->
            <div class="message-filler"></div>
        </div>
    </div>
</template>

<script>
import MessagesService from '../../services/messages-service';
import { Subscription } from 'rxjs';
import { mapState } from 'vuex';

const data = {
    /** @type {Message[]} */
    messages: []
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
        })
    },
    methods: {},
    created() {
        if (!this.authenticated) console.error('User not authenticated');

        messagesObservable = MessagesService.getMessageSubscription().subscribe(message => {
            this.messages.unshift(message);
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



// const authModule = namespace('authModule');

// @Component({})
// export class Messages extends Vue {
//     // public messages = [];
//     // @authModule.State('userId') public userId: number;
//     // @authModule.State('authenticated') public authenticated: boolean;

//     private messagesObservable: Subscription;

//     created() {
//         if (!this.authenticated) console.error('User not authenticated');

//         this.messagesObservable = MessagesService.getMessageSubscription().subscribe((message: Message) => {
//             // console.log(message);
//             this.messages.unshift(message);
//         }, err => {
//             console.log('error', err);
//         }, () => {
//             console.log('complete');
//         })
//         // console.log(MessagesService);
//         // this.$getService('test');
//     }

//     destroyed() {
//         this.messagesObservable.unsubscribe();
//     }
// }
</script>

<style lang="scss" scoped>
@import '@/assets/styles/consts.scss';

.messages-wrapper {
    position: absolute;
    display: flex;
    top: 0; bottom: 0; left: 0; right: 0;
    margin-bottom: 56px;
    border-radius: 15px;
    // padding: 30px 0;
    background-color: $background-color-1;
    // overflow-y: scroll;

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

            &:first-of-type { margin-bottom: 0; }

            // .single-message__content { display: inline-block; }
            .single-message__content {
                display: inline-block; padding: 10px 15px; border-radius: 20px;
                background-color: $background-color-global;
            }

            &.user-message {
                align-self: flex-start;

                .single-message__content { background-color: $color-1; }
            }
        }
        .message-filler { margin-bottom: 40px; width: 100%; }
    }

}
</style>