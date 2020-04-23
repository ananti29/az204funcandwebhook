const API_BASE_URL = 'https://escalator-functions-az-204-exam.azurewebsites.net';

const app = new Vue({
    el: '#app',
    data() {
        return {
            stocks: [],
            connectionInfo: {}
        }
    },
    watch: {
        connectionInfo: function (val) {
            if(this.connectionInfo.url) {
                this.connect();
            }
          }
    },
    methods: {
        async getStocks() {
            try {
                const apiUrl = `${API_BASE_URL}/api/getStocks`;
                const response = await axios.get(apiUrl);
                this.stocks = response.data.stocks
                return this.stocks;
            } catch (ex) {
                console.error(ex);
            }
        },
        async getConnectionInfo() {
            try {
                const apiUrl = `${API_BASE_URL}/api/negotiate`;
                const response = await axios.get(apiUrl);
                this.connectionInfo = response.data.connectionInfo
                return this.connectionInfo;
            } catch (ex) {
                console.error(ex);
            }
        },
        connect() {
            try {
                var vm = this;
                const connection = new signalR.HubConnectionBuilder()
                    .withUrl(vm.connectionInfo.url, {
                       accessTokenFactory: function () {
                            return vm.connectionInfo.accessToken
                        }
                    })
                    .configureLogging(signalR.LogLevel.Warning)
                    .build();

                connection.onclose(function () {
                    console.log('SignalR connection disconnected');
                    setTimeout(function () {
                        vm.connect(), 2000
                    });
                });

                connection.on('updated', function (updatedStock) {
                    const index = vm.stocks.findIndex(function (s) {
                        return s.id === updatedStock.id;
                    });
                    vm.stocks.splice(index, 1, updatedStock);
                });

                connection.start().then(function () {
                    console.log("SignalR connection established");
                }).catch(err => console.error(err));



            } catch (error) {
                console.error(error);
            }
        }
    },
    created() {
        this.getStocks();
        this.getConnectionInfo();
    }

});