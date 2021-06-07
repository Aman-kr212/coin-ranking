<template>
  <v-container fluid>
    <v-card>
      <v-data-table
        disable-sort
        v-if="currencyList.length"
        :headers="headers"
        :items="currencyList"
        :items-per-page="10"
        :footer-props="{ 'items-per-page-options': [10, 25, 50, 100] }"
      >
        <template #item.icon="{ item }">
          <v-img
            :src="item.icon"
            :alt="item.name"
            max-height="40px"
            max-width="40px"
          >
          </v-img>
        </template>
        <template #item.change="{ item }">
          <span :style="{ color: item.change < 0 ? 'red' : 'green' }"
            >{{ item.change }}%</span
          >
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "currency-list",

  data() {
    return {
      headers: [
        {
          text: "Icon",
          value: "icon",
        },
        {
          text: "Name",
          value: "name",
        },
        {
          text: "Symbol",
          value: "symbol",
        },
        {
          text: "Price",
          value: "price",
        },
        {
          text: "Change",
          value: "change",
        },
      ],
    };
  },

  computed: {
    currencyList() {
      return this.$store.state.coins;
    },
  },
};
</script>