<template>
    <div class="input-wrapper">
        <p v-if="true">{{ label }}</p>
        <input :style="{ 'text-align': textAlign }" :type="type" :value="value" @input="onInputChanged">
    </div>
</template>

<script>

export default {
    name: 'InputForm',
    model: {
        prop: 'value',
        event: 'change'
    },
    props: {
        label: String,
        type: {
            type: String,
            default: 'text'
        },
        value: String,
        textAlign: {
            type: String,
            default: 'left'
        }
        // value: 
    },
    methods: {
        onInputChanged($event) {
            this.$emit('change', $event.target.value);
        }
    }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/consts.scss';

.input-wrapper {
    width: 100%;
    max-width: 250px;
    margin-bottom: 25px;

    p { font-size: 16px; margin: 0; text-align: center; }
    input {
        width: 100%; box-sizing: border-box; font-size: 15px; padding: 6px 15px; border-radius: 5px;
        // color: #3c3c3c;
        color: #eaeaea;
        border: 1px solid #eaeaea;
        background-color: $background-color-global;

        &:focus { outline: none; }
    }
}
</style>
