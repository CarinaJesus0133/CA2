<template>
  <v-card class="pa-4 elevation-0">
    <template v-for="(item, i) in list">
      <v-row justify="space-between" :key="i">
        <v-col cols="auto">
          {{ item.name }} <br />
          {{ item.location }}
        </v-col>

        <v-col cols="auto">
          <v-btn @click="modal = true" tile> Check <br> Availability </v-btn>
        </v-col>
      </v-row>
      <v-divider :key="'0' + i" />
    </template>
    <v-dialog v-model="modal">
      <modal title="abc" @close="modal = false">
        <availability-table> </availability-table>
      </modal>
    </v-dialog>
  </v-card>
</template>

<script>
import AvailabilityTable from './AvailabilityTable.vue';
import Modal from './Modal.vue';

export default {
  components: {
    Modal,
    AvailabilityTable,
  },
  data: () => ({
    modal: false,
  }),
  props: ['list'],
};
</script>
