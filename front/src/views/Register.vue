<template>
  <v-container fill-height>
    <v-row justify="center">
      <v-col cols="auto">
        <v-card width="350" class="pa-4">
          <v-row justify="end">
            <v-col cols="auto">
              <v-switch
                v-model="isHairdresser"
                label="I'm a hairdresser"
              ></v-switch>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="user.name"
                outlined
                dense
                label="Full name"
              />

              <v-text-field
                v-model="user.phone"
                outlined
                dense
                label="Phone number"
              />

              <v-text-field
                v-model="user.email"
                type="email"
                outlined
                dense
                label="Email"
              />

              <v-text-field
                v-model="user.location"
                v-if="isHairdresser"
                outlined
                dense
                label="Location"
              />

              <v-text-field
                v-model="user.password"
                outlined
                dense
                label="Password"
                type="password"
              />

              <v-btn tile @click="register()"> Register </v-btn>
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
    isHairdresser: false,
    user: {},
  }),
  methods: {
    register() {
      if (this.isHairdresser) {
        this.user.user_type = 2;
      } else {
        this.user.user_type = 1;
      }
      axios.get('https://ca2-api.herokuapp.com/register', {
        params: {
          ...this.user, // it sets all the user's attrs into this obj
        },
      }).then((response) => {
        if (response.data.error) {
          alert('Could not register');
        } else {
          this.$router.push({ name: 'Login' });
        }
        console.log(response.data);
      });
    },
  },
};
</script>
