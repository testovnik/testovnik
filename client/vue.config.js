module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "~@/assets/sass/variables.sass"`,
      },
    },
  },
}
