module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "~@/assets/sass/variables.sass"'
      }
    }
  }
  // devServer: {
  //   proxy: {
  //     "/api": {
  //       target: "https://testovnik-api.herokuapp.com",
  //       changeOrigin: true
  //     }
  //   }
  // }
}
