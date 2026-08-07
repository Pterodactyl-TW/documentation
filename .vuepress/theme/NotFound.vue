<template>
    <div class="theme-container">
        <div class="content error-page">
            <router-link to="/" class="error-logo">
                <img src="/logos/pterry.svg" alt="Pterodactyl" />
            </router-link>
            <h1>404</h1>
            <p class="error-message">{{ getMsg() }}</p>
            <p class="error-path"><code>{{ path }}</code></p>
            <div class="error-actions">
                <router-link to="/" class="button">帶我回首頁</router-link>
                <router-link to="/project/introduction.html" class="button button-outline">瀏覽文件</router-link>
            </div>
        </div>
    </div>
</template>

<script>
    const msgs = [
        `這裡什麼都沒有。`,
        `我們是怎麼到這裡的？`,
        `這是 404 頁面。`,
        `看來有些連結已經失效了。`,
        `到底是誰又讓 Dogmeat 動了文件？`,
        `有人又把網路線拔掉了……`,
        `找不到那位船長，要不要重新開始？`,
        `我已經不想再玩躲貓貓了。`,
        `這隻翼手龍好像飛錯地方了。`,
        `伺服器很正常，是這個網址怪怪的。`,
        `你在找的頁面請假沒來上班。`,
        `別擔心，這不是你的錯，是網址的錯。`,
        `這裡只有回音，沒有頁面。`,
        `Wings 找不到這個容器耶。`,
        `這個 Egg 好像孵不出東西來。`,
        `文件搬家了，但沒留下新地址。`,
        `試著重新整理，或乾脆換條路走。`,
        `此路不通，請改道回首頁。`
    ];

    export default {
        data() {
            return {
                path: this.$route ? this.$route.path : ''
            };
        },
        methods: {
            getMsg() {
                return msgs[Math.floor(Math.random() * msgs.length)];
            }
        }
    };
</script>

<style lang="postcss">
@import "./styles/main.css";
</style>
