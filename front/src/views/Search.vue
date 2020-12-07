<template>
  <v-container class="fill-height">
    <v-row justify="center">
      <v-col cols="10">
        <v-card class="px-4">
          <v-row align="center">
            <v-col>
              <v-row>
                <v-col> {{username}} </v-col>
              </v-row>
              <v-row>
                <v-col>
                  Type here the name or location of the hairdressers
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    dense
                    outlined
                    label="Search"
                    @keydown.enter="search"
                    v-model="searchStr"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
            <v-divider vertical />
            <v-col>
              <search-list :list="searchReultList"> </search-list>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SearchList from '@/components/SearchList.vue';
import axios from 'axios';

export default {
  components: { SearchList },
  name: 'Search',
  data: () => ({
    searchReultList: [],
    searchStr: '',
    username: JSON.parse(localStorage.getItem('user')).name,
  }),
  methods: {
    search() {
      axios
        .get('https://ca2-api.herokuapp.com/search', {
          params: {
            filter: this.searchStr,
          },
        })
        .then((response) => {
          this.searchReultList = response.data;
        });
    },
  },
};
</script>
