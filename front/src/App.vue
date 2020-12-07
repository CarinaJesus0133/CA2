<template>
  <v-app>
    <v-main>
      <router-link v-if="!isLoginPage" :to="route"> Home </router-link><br>
      <router-link v-if="!isLoginPage" :to="{name: 'Login'}"> Exit </router-link>
    <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  computed: {
    // Returns the proper home route for the user
    route() {
      // transform the json string into a js obj
      const user = JSON.parse(localStorage.getItem('user'));
      if (user !== null) {
        if (user.user_type === 1) {
          return '/home/customer';
        }
      }

      return '/home/hairdresser';
    },
    isLoginPage() {
      return this.$route.name === 'Login';
    },
  },
};
</script>
