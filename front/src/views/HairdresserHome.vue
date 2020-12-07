<template>
  <v-container fill-height>
    <v-row justify="center">
      <v-col cols="auto">
        <v-card width="350" class="pa-4">
          <v-btn block tile @click="modal2 = true"> Set availability </v-btn>
          <v-divider class="my-4"></v-divider>
          <v-btn block tile @click="checkReservations()"> Check reservations </v-btn>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="modal" width="600px">
      <hairdresser-check-appointment-modal :appointments="appointments" @close="modal = false"/>
    </v-dialog>
    <v-dialog v-model="modal2">
      <modal title="abc" @close="modal2 = false">
        <availability-table > </availability-table>
      </modal>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios';
import AvailabilityTable from '../components/AvailabilityHairdresser.vue';
import HairdresserCheckAppointmentModal from '../components/HairdresserCheckAppointmentModal.vue';
import Modal from '../components/Modal.vue';

export default {
  components: {
    HairdresserCheckAppointmentModal,
    AvailabilityTable,
    Modal,
  },
  data: () => ({
    modal: false,
    modal2: false,
    appointments: [],
  }),
  methods: {
    checkReservations() {
      this.getReservations();
    },
    getReservations() {
      axios.get('https://ca2-api.herokuapp.com/reservations', {
        params: {
          id: JSON.parse(localStorage.getItem('user')).hairdresserId,
        },
      }).then((response) => {
        console.log(response.data);
        this.appointments = response.data;
        this.modal = true;
      });
    },
  },
};
</script>
