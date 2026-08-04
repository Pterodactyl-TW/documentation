<template>
    <div class="home">
        <div class="header section bg-blue text-grey-lightest less-padding emphasize">
            <div class="container z-10">
                <div class="text-center">
                    <div>
                        <img class="max-w-xl w-full inline-block" src="https://cdn.pterodactyl.io/logos/new/pterodactyl_logo_transparent.png" alt="Pterodactyl">
                    </div>
                    <div class="mt-4">
                        <!-- <a class="btn hidden md:inline-block" href="https://demo.pterodactyl.io" target="_blank" rel="nofollow noopener">Demo</a> -->
                        <router-link class="btn inline-block" to="/panel/getting_started.html">開始使用！</router-link>
                    </div>
                </div>
            </div>
        </div>
        <div class="section bg-white">
            <div class="container text-center">
                <h1 class="text-blue mb-4">Pterodactyl 面板</h1>
                <h3 class="border-0 font-normal leading-normal mx-auto" style="max-width: 50rem">
                    Pterodactyl&reg; 是一款免費、開放原始碼的遊戲伺服器管理面板，採用 PHP、React 與 Go 建置。
                    Pterodactyl 以安全性為設計核心，將所有遊戲伺服器執行於隔離的 Docker 容器中，
                    同時為終端使用者提供美觀且直覺的使用介面。
                </h3>
                <h3 class="border-0 leading-normal mx-auto mt-4" style="max-width: 50rem">
                    別再接受次等方案，讓遊戲伺服器成為你平台上的核心服務。
                </h3>
                <img class="max-w-lg w-full m-4 inline-block" src="https://cdn.pterodactyl.io/site-assets/mockup-macbook-grey-1.0.png">
            </div>
        </div>
        <div class="section bg-blue text-grey-lightest">
            <div class="container text-center">
                <h1 class="mb-4">為什麼選擇 Pterodactyl&reg;？</h1>
                <div class="flex flex-wrap">
                    <div class="feature">
                        <span><i class="icon icon-lock"></i></span>
                        <h3>安全至上</h3>
                        <p>平台將安全性視為核心要務，內建 bcrypt 雜湊、AES-256-CBC 加密與 HTTPS 支援。</p>
                    </div>
                    <div class="feature">
                        <span><i class="icon icon-beaker"></i></span>
                        <h3>現代化工具</h3>
                        <p>採用現代技術堆疊與最佳設計實務，讓你能輕鬆開始使用並進行修改。</p>
                    </div>
                    <div class="feature">
                        <span><i class="icon icon-anchor"></i></span>
                        <h3>以 Docker 為核心</h3>
                        <p>所有伺服器都執行於隔離的 Docker 容器中，以降低攻擊面、提供嚴格的資源限制，並為各款遊戲提供量身打造的環境。</p>
                    </div>
                    <div class="feature">
                        <span><i class="icon icon-wallet"></i></span>
                        <h3>免費且開放原始碼</h3>
                        <p>Pterodactyl 完全免費，採用 MIT 授權條款，所有程式碼也都完全開放原始碼。</p>
                    </div>
                    <div class="feature">
                        <span><i class="icon icon-browser"></i></span>
                        <h3>易於使用</h3>
                        <p>把瘋狂點擊與吶喊留給 Overwatch 吧。Pterodactyl 的介面設計得如此完善，就連新手也能輕鬆使用。</p>
                    </div>
                    <div class="feature">
                        <span><i class="icon icon-expand"></i></span>
                        <h3>可擴充</h3>
                        <p>無論你是託管商、下一個 Hyplex，還是只想和朋友玩遊戲，我們都能滿足你的需求。</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="section bg-white">
            <div class="text-center">
                <h1>螢幕截圖</h1>
                <div class="screenshots">
                    <slick ref="slick" :options="slickOptions">
                        <a href="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-1.png">
                            <img src="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-1.png">
                        </a>
                        <a href="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-2.png">
                            <img src="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-2.png">
                        </a>
                        <a href="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-3.png">
                            <img src="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-3.png">
                        </a>
                        <a href="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-4.png">
                            <img src="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-4.png">
                        </a>
                        <a href="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-5.png">
                            <img src="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-5.png">
                        </a>
                        <a href="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-6.png">
                            <img src="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-6.png">
                        </a>
                        <a href="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-7.png">
                            <img src="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-7.png">
                        </a>
                        <a href="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-8.png">
                            <img src="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-8.png">
                        </a>
                        <a href="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-9.png">
                            <img src="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-9.png">
                        </a>
                        <a href="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-10.png">
                            <img src="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-10.png">
                        </a>
                        <a href="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-11.png">
                            <img src="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-11.png">
                        </a>
                    </slick>
                </div>
            </div>
        </div>
        <div class="section bg-blue text-grey-lightest">
            <div class="container text-center">
                <h1>開始使用</h1>
                <p class="m-4">準備好搭乘 Pterodactyl 起飛了嗎？</p>
                <div class="mt-4">
                    <router-link class="btn inline-block" to="/project/introduction.html">關於本專案</router-link>
                    <a class="btn inline-block" href="https://discord.gg/pterodactyl">Discord</a>
                </div>
            </div>
        </div>
        <div class="section bg-black text-grey-lighter text-sm less-padding">
            <div class="container text-center">
                <div>
                    <img class="h-20" :src="$withBase('logos/banner_logo.png')" alt="pterodactyl banner logo">
                </div>
                <div class="text-left md:flex">
                    <div class="flex-none w-full md:w-1/2 md:pr-12">
                        <p class="my-4">
                            Since 2015 Pterodactyl&reg; has been delivering robust, performant, and secure software that allows
                            individuals, networks, and hosting companies to run game servers at scale; easily. Best of all?
                            No exorbitant monthly costs.
                        </p>
                        <p class="my-4">
                            Take the plunge today and discover why thousands of users trust Pterodactyl&reg; to manage their
                            game servers.
                        </p>
                    </div>
                    <div class="hidden md:block md:flex-1 md:pr-12">
                        <p><a class="text-grey-lightest" href="https://github.com/pterodactyl">GitHub</a></p>
                        <p><a class="text-grey-lightest" href="https://github.com/sponsors/pterodactyl">贊助</a></p>
                        <p><a class="text-grey-lightest" href="https://github.com/sponsors/pterodactyl">捐款</a></p>
                        <p><a class="text-grey-lightest" href="/panel/troubleshooting.html">疑難排解</a></p>
                        <p><a class="text-grey-lightest" href="https://pterodactyleggs.com">其他遊戲設定</a></p>
                    </div>
                    <div class="text-center mt-8 md:flex-1 md:mt-0">
                        <a href="https://discord.gg/pterodactyl" target="_blank" rel="nofollow noopener">
                            <img src="https://cdn.pterodactyl.io/site-assets/discord.png" class="w-3/4">
                        </a>
                    </div>
                </div>
                <div class="footer">採用 MIT 授權條款 | Pterodactyl&reg; 版權所有 &copy; Dane Everitt 與貢獻者</div>
            </div>
        </div>
    </div>
</template>

<script>
    import Swal from 'sweetalert2';
    import 'sweetalert2/dist/sweetalert2.min.css';
    import NavLink from './NavLink.vue';
    import Slick from './SlickCarousel.vue';

    export default {
        components: { NavLink, Slick },
        mounted() {
            Swal.fire({
                title: 'Pterodactyl TW',
                text: '你現在看到的是 Pterodactyl TW，這是一個非官方的繁體化專案，裡面的內容可能會與官方的最新版有衝突，請以官方所描述的為主。',
                icon: 'info',
                allowOutsideClick: false,
                showDenyButton: true,
                confirmButtonText: '我知道了',
                denyButtonText: '我要看官方的'
            }).then(result => {
                if (result.isDenied) {
                    window.location.href = 'https://pterodactyl.io';
                }
            });
        },
        data() {
            return {
                slickOptions: {
                    slidesToShow: 1,
                    centerMode: true,
                    centerPadding: '0',
                    speed: 1000,
                    autoplay: true,
                    variableWidth: true,
                    arrows: false,
                    dots: true,
                    pauseOnHover: false,
                    pauseOnDotsHover: true,
                },
            }
        },
        computed: {
            data() {
                return this.$page.frontmatter;
            },
            actionLink() {
                return {
                    link: this.data.actionLink,
                    text: this.data.actionText
                };
            }
        },
    };
</script>

<style>
    .swal2-title {
        border-bottom: 0 !important;
    }
</style>
