<template>
  <v-card>
    <v-row>
      <v-col cols="auto">
        <v-text-field
          v-model="date2"
          class="ma-2"
          dense
          outlined
          label="Date"
          type="date"
          @keydown.enter="search"
        ></v-text-field>
      </v-col>
      <v-col cols="auto">
        <v-btn @click="search" tile large class="mr-2 mt-2"> Search </v-btn>
      </v-col>
    </v-row>
    <v-data-table :headers="headers" :items="items" hide-default-footer>
      <template v-slot:item.appointmentId="{ item }">
        <v-btn @click="$emit('', item), makeAppointment(item)" tile> Select </v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="modal" width="400">
      <modal title="Booking Confirmation" @close="modal = false">
        <booking-confirmation />
      </modal>
    </v-dialog>
    <v-dialog v-model="modal2" width="400">
      <modal title="Warning" @close="modal2 = false">
        Appointment not available
      </modal>
    </v-dialog>
  </v-card>
</template>

<script>
import axios from 'axios';
import BookingConfirmation from './BookingConfirmation.vue';
import Modal from './Modal.vue';

export default {
  components: { Modal, BookingConfirmation },
  created() {
    this.search();
  },
  data: () => ({
    date: '',
    date2: new Date().toISOString().slice(0, 10), // used to model for the date input
    modal: false,
    modal2: false,
    appointments: [],
    headers: [
      {
        text: 'Date',
        value: 'date',
      },
      {
        text: 'Time',
        value: 'time',
      },
      {
        text: 'Availability',
        value: 'availability',
      },
      {
        text: 'Select',
        value: 'appointmentId',
      },
    ],
    times: ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'],
  }),
  computed: {
    items() {
      // transform the hours of times object into lines to put in the table
      return this.times.map((time) => {
        // finds the appointment with the current hour
        const appointment = this.appointments.find((f) => f.time === time);
        let available = false;
        let appointmentId = 0;

        if (appointment) {
          available = appointment.available === 1;
          appointmentId = appointment.id;
        }
        return {
          date: this.date,
          time,
          availability: available,
          appointmentId,
        };
      });
    },
  },
  methods: {
    // send req to server to create an appointment for de sent date
    makeAppointment(appointment) {
      if (appointment.availability) {
        this.modal = true;
        const { customerId } = JSON.parse(localStorage.getItem('user'));

        axios.get('https://ca2-api.herokuapp.com/booking', {
          params: {
            appointmentId: appointment.appointmentId,
            customerId,
          },
        }).then(() => {
          // update table data when send data to server
          this.search();
        });
      } else {
        this.modal2 = true;
      }
    },
    search() {
      this.date = this.date2;
      axios.get('https://ca2-api.herokuapp.com/list-appointments', {
        params: {
          date: this.date,
        },
      }).then((response) => {
        this.appointments = response.data;
        console.log(response.data);
      });
    },
  },
};
</script>
