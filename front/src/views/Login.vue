<template>
  <v-container fill-height>
    <v-row justify="center">
      <v-col cols="auto">
        <v-card width="350" class="pa-4">
          <v-row>
            <v-col>
              <v-text-field v-model="email" outlined dense label="Email" />

              <v-text-field
                v-model="password"
                outlined
                dense
                label="Password"
                type="password"
              />

              <v-btn @click="login" tile> Login </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <span>
                Don't you have an account? <br />
                 <router-link :to="{name: 'Register'}"> Register </router-link>
              </span>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data: () => ({
    email: '',
    password: '',
  }),
  methods: {
    login() {
      axios
        .get('https://ca2-api.herokuapp.com/login', {
          params: { email: this.email, password: this.password },
        })
        .then((response) => {
          const { data } = response;
          if (data.error) {
            window.alert('Fail to login');
          } else {
            delete data.error;
            localStorage.setItem('user', JSON.stringify(data));
            let route = '';
            if (data.user_type === 1) {
              route = 'CustomerHome';
            } else {
              route = 'HairdresserHome';
            }
            this.$router.push({ name: route });
          }
        });
    },
  },
};
</script>
