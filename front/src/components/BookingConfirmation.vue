<template>
  <v-container>
    <v-row>
      {{ username }}
    </v-row>
    <v-row justify="center"> Booking confirmed </v-row>
    <v-row justify="center"> You can see your reservations in your home page </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    username: JSON.parse(localStorage.getItem('user')).name,
  }),
};
</script>
