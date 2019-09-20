server = 'http://localhost:5000';

new Vue(
    {
        el: '#app',
        data: {
            brands: [],
            foods: [],
            chemicals : [],
            isNew: false,
            selectedBrand : 0,
            selectedFood : 0,
            loading: true,
            errored: false
        },
        methods: {
            getFoods(){
                axios
                .get(server + '/brands/' + this.selectedBrand + '/foods')
                .then(response => {
                  this.foods = response.data
                })
                .catch(error => {
                  console.log(error)
                  this.errored = true
                })
                .finally(() => this.loading = false)
            },
            getChemicals(){
                axios
                .get(server + '/brands/' + this.selectedBrand + '/foods/' + this.selectedFood + '/chemicals')
                .then(response => {
                  this.chemicals = response.data
                })
                .catch(error => {
                  console.log(error)
                  this.errored = true
                })
                .finally(() => this.loading = false)
            }        
        },

        mounted () {
            axios
              .get(server + '/brands')
              .then(response => {
                this.brands = response.data
              })
              .catch(error => {
                console.log(error)
                this.errored = true
              })
              .finally(() => this.loading = false)
          }
    }
)