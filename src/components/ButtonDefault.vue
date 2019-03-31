<template>
    <button type="button" class="btn button-default" @click="onClick">{{ text }}</button>
</template>

<script>

export default {
    name: 'ButtonDefault',
    props: {
        text: String
    },
    methods: {
        onClick() {
            this.$emit('on-click');
        }
    }
}

</script>

<style lang="scss" scoped>
@import '../assets/styles/consts.scss';

.button-default {
    background-color: $color-1;
    font-size: 18px;
    padding: 10px 35px;
    border-radius: 5px;
    border: 1px solid $color-1;
    transition: background-color 0.3s;

    &:hover { background-color: #53b755; transition: background-color 0.2s ease-out; }
}
</style>