<template>
    <div class="login-wrapper">
        <Login/>
    </div>
</template>

<script>
import Vue from 'vue';
import Login from './Login.vue';

export default {
    name: 'LoginPage',
    components: {
        Login
    }
}
</script>

<style lang="scss" scoped>
.login-wrapper {
    width: 100%;
    padding: 10px 0;
}
</style>
