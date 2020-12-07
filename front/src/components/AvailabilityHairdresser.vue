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
        <v-btn @click="setAvailability(item, 1)" tile> Available </v-btn>
        <v-btn @click="setAvailability(item, 2)" tile> Unavailable </v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import axios from 'axios';

export default {
  created() {
    this.search();
  },
  data: () => ({
    date: '',
    date2: new Date().toISOString().slice(0, 10), // used to model for the date input
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
    times: [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
    ],
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
    setAvailability(appointment, value) {
      this.modal = true;

      axios
        .get('https://ca2-api.herokuapp.com/set-availability', {
          params: {
            id: appointment.appointmentId,
            date: appointment.date,
            time: appointment.time,
            value,
            hairdresser: JSON.parse(localStorage.getItem('user')).hairdresserId,
          },
        })
        .then(() => {
          // update table data when send data to server
          this.search();
        });
    },
    search() {
      this.date = this.date2;
      axios
        .get('https://ca2-api.herokuapp.com/list-appointments', {
          params: {
            date: this.date,
          },
        })
        .then((response) => {
          this.appointments = response.data;
          console.log(response.data);
        });
    },
  },
};
</script>
