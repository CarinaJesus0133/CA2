<template>
  <modal title="Customer appointment" @close="$emit('close')">
    <v-row>
      <v-col cols="auto">
        <span> Your name: {{ username }}</span>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row align="center" v-for="(appointment, i) in appointments" :key="i">
      <v-col cols="auto">
        Hairdresser {{ appointment.name }} <br />
        {{ appointment.time }} {{ appointment.date }}
      </v-col>
      <v-spacer></v-spacer>
      <v-col>
        <v-btn tile @click="modal = true, idCancel = appointment.id"> Cancel </v-btn>
      </v-col>
    </v-row>
    <v-dialog v-model="modal" width="300px">
      <modal title="Cancelation" @close="modal = false">
        Do you want to cancel this appointment?

        <v-row>
          <v-col>
            <v-btn @click="cancel()">Yes</v-btn>
          </v-col>
          <v-col>
            <v-btn>Not</v-btn>
          </v-col>
        </v-row>
      </modal>
    </v-dialog>
  </modal>
</template>

<script>
import axios from 'axios';
import Modal from './Modal.vue';

export default {
  components: { Modal },
  props: ['appointments'],
  data: () => ({
    modal: false,
    username: JSON.parse(localStorage.getItem('user')).name,
    idCancel: 0,
  }),
  methods: {
    cancel() {
      axios.get('https://ca2-api.herokuapp.com/cancel-appointment', {
        params: {
          id: this.idCancel,
        },
      }).then(() => {
        this.modal = false;
        this.$emit('close');
      });
    },
  },
};
</script>

<style>
</style>
