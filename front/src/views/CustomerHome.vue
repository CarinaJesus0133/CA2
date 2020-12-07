<template>
  <v-container fill-height>
    <v-row justify="center">
      <v-col cols="auto">
        <v-card width="350" class="pa-4">
          <v-btn @click="gotoSearch()" block tile> Book an appointment </v-btn>
          <v-divider class="my-4"></v-divider>
          <v-btn block tile @click="openModal"> Check your appointments </v-btn>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="modal" width="400px">
      <customer-check-appointment-modal :appointments="appointments" @close="modal = false"/>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios';
import CustomerCheckAppointmentModal from '../components/CustomerCheckAppointmentModal.vue';

export default {
  components: {
    CustomerCheckAppointmentModal,
  },
  data: () => ({
    modal: false,
    appointments: [],
  }),
  methods: {
    openModal() {
      this.modal = true;
      this.getLastAppointments();
    },
    gotoSearch() {
      this.$router.push({ name: 'Search' });
    },
    getLastAppointments() {
      axios.get('https://ca2-api.herokuapp.com/last-appointments', {
        params: {
          customerId: JSON.parse(localStorage.getItem('user')).customerId,
        },
      }).then((response) => {
        console.log(response.data);
        this.appointments = response.data;
      });
    },
  },
};
</script>
