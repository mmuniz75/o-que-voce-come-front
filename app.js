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
        watch: {
            selectedBrand : function(){
                this.selectedFood=0
                this.isNew = false
                this.foods = []
                this.chemicals = []
                if(this.selectedBrand==0)
                    return;
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
            selectedFood : function(){
                this.isNew = false
                this.chemicals = []
                if(this.selectedFood==0)
                    return;
                axios
                .get(server + '/brands/' + this.selectedBrand + '/foods/' + this.selectedFood + '/chemicals')
                .then(response => {
                  this.chemicals = response.data
                  this.isNew = this.chemicals.length == 0
                })
                .catch(error => {
                  console.log(error)
                  this.errored = true
                  this.isNew = true
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