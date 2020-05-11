<template>
    <div>
        <Navbar />
        <div class="container">
            <img
                    class="doodle"
                    src="@/assets/component.png"
                    alt="Artwork by https://absurd.design/illustrations.html"
            />
            <template v-if="this.$store.getters.isAuthenticated">
                My Profile
            </template>
            <template v-else>
                Not
            </template>
        </div>
    </div>
</template>

<script>
    import Navbar from "./Navbar"
    export default {
        name: "MyProfile",
        components: { Navbar },
    }
</script>

<style lang="sass" scoped>
    .container
        display: flex
        align-items: center
        flex-direction: column
        font-family: $roboto-mono
        background: $background 0% 0% no-repeat padding-box
        height: calc(100vh - 65px)
        width: 100%
</style>