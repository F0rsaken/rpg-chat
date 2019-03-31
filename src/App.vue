<template>
    <div id="app" class="app-wrapper">
        <!-- <router-link to="/">Home2</router-link> | -->
        <!-- <router-link to="/about">About</router-link> -->
        <router-view/>
    </div>
</template>

<style lang="scss">
@import '@/assets/styles/consts.scss';

#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
}

.app-wrapper {
    display: flex;
    position: relative;
    background-color: $background-color-global;
    min-height: 100vh;
    min-width: 100vw;
}
</style>
