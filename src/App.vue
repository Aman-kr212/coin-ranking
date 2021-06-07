<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title class="name ml-3">
        Crypto Currency Ranking
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
            :disabled="isRefreshing"
            @click="refreshData"
            class="mr-5"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </template>
        <span>Refresh Coins</span>
      </v-tooltip>
    </v-app-bar>

    <v-main>
      <currency-list></currency-list>

      <v-snackbar
        v-model="showSnackbar"
        timeout="5000"
        :color="snackbarStatus === 'fail' ? 'red' : 'green'"
      >
        {{ message }}
        <template v-slot:action="{ attrs }">
          <v-btn text v-bind="attrs" @click="showSnackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script>
import Axios from "axios";
import CurrencyList from "./components/CurrencyList.vue";

export default {
  name: "App",

  components: {
    CurrencyList,
  },

  data: () => ({
    showSnackbar: false,
    snackbarStatus: "",
    message: "",
    refreshInterval: null,
    isRefreshing: false,
  }),

  created() {
    this.fetchCoinsData();
    this.setRefreshInterval();
  },

  methods: {
    fetchCoinsData() {
      const coins = [];
      const url = "https://api.coinranking.com/v1/public/coins/?limit=100";
      Axios.get(url)
        .then((response) => {
          window.r = response;
          if (response.data.data.coins.length) {
            const currency = response.data.data.base.sign;
            response.data.data.coins.forEach((coin) => {
              coins.push({
                icon: coin.iconUrl,
                name: coin.name,
                symbol: coin.symbol,
                price: `${currency} ${Number(coin.price).toFixed(3)}`,
                change: coin.change,
              });
            });
            this.$store.commit("SET_COINS_DATA", [...coins]);
            if (this.isRefreshing) {
              this.openSnackBar("Data Refreshed", "success");
              this.isRefreshing = false;
            }
          }
        })
        .catch((error) => {
          let message = "";
          if (!this.$store.state.coins.length || this.isRefreshing) {
            if (!error.response && error.message === "Network Error") {
              message = "Please Check your Internet Connection";
            } else {
              message = "Something wwnt wrong. Please try after sometime";
            }
            this.openSnackBar(message, "fail");
          }
          this.isRefreshing = false;
        });
    },

    refreshData() {
      this.isRefreshing = true;
      this.fetchCoinsData();
    },

    setRefreshInterval() {
      this.refreshInterval = setInterval(() => {
        this.fetchCoinsData();
      }, 20 * 1000);
    },

    openSnackBar(message, status) {
      this.showSnackbar = true;
      this.message = message;
      this.snackbarStatus = status;
    },
  },

  beforeDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  },
};
</script>
