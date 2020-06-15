<template>
  <button class="base-button">
    <slot />
  </button>
</template>

<style lang="sass" scoped>
.base-button
  outline: none
  border: none
  background-color: $light-gray
  cursor: pointer
  font-family: 'Roboto Mono'
  color: $dark-gray
  border-radius: $border-radius
  padding: 10px 20px
  &:hover
    box-shadow: 1px 1px 3px $shadow

  &:not(:first-of-type)
    margin-left: 15px

  &--secondary
    background: none

</style>
