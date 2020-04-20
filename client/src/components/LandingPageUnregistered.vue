<template>
  <div>
    <Navbar />
    <div class="container">
      <img
        class="doodle"
        src="@/assets/component.png"
        alt="Artwork by https://absurd.design/illustrations.html"
      />
    </div>
    <Footer />
  </div>
</template>

<script>
import Navbar from "./Navbar";
import Footer from "./Footer";
export default {
  name: "LandingPageUnregistered",
  components: {
    Navbar,
    Footer
  }
};
</script>

<style></style>
