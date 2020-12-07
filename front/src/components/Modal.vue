<template>
  <v-card >
    <v-card-title class="px-0 pt-0">
      <v-app-bar dense color="primary" dark>
        {{title}}
        <v-spacer></v-spacer>

        <v-btn icon small class="mr-0" @click="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>
    </v-card-title>

    <v-card-text>
      <slot/>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ['title'],
};
</script>

<style>

</style>
