/server = 'http://localhost:5000';

server = 'http://35.229.29.128:5000';

new Vue(
    {
        el: '#app',
        data: {
            brands: [],
            foods: [],
            chemicals : [],
            selectedBrand : 0,
            selectedFood : 0,
            loading: false,
            errored: false,
            message: '',
            inputFood: '',
            inputBrand: '',
            inputBarCode: '',
            selectedChemicals: []

        },
        methods: {
            
            loadBrands(){
              axios
              .get(server + '/foods/' + this.selectedFood + '/brands')
              .then(response => {
                this.brands = response.data
              })
              .catch(error => {
                this.handleServerError(error)
              })
              .finally(() => this.loading = false)
            },
            loadFoodBrandChemicals(){
              this.loading = true
              axios
              .get(server + '/brands/' + this.selectedBrand + '/foods/' + this.selectedFood + '/chemicals')
              .then(response => {
                this.chemicals = response.data
              })
              .catch(error => {
                  this.selectedBrand = 0;
                  this.selectedFood = 0;
                  this.handleServerError(error)
              })
              .finally(() => this.loading = false)
            },
            handleServerError(error){
              this.loading = false
              console.log(error)
              this.errored = true
              if(error.response && error.response.data && error.response.data.message)
                this.message=error.response.data.message 
              else
                this.message = "Ocorreu um erro.Tente novamente mais tarde."
              $('#dialogModal').modal('show')
            },
            compare( a, b ) {
              if ( a.name.toLowerCase() < b.name.toLowerCase() ){
                return -1;
              }
              if ( a.name.toLowerCase() > b.name.toLowerCase() ){
                return 1;
              }
              return 0;
            },
            openRegister() {
              document.location.href="register.html";
            }
        },
        watch: {
            selectedBrand: function(){
              this.chemicals = []
              if(this.selectedBrand==0 || this.selectedFood==0)
                    return;
              
              this.loadFoodBrandChemicals();
            },  

            selectedFood: function(){
              this.chemicals = []
              this.brands = [];
              this.selectedBrand=0
              if(this.selectedFood==0)
                  return;

              this.loadBrands();
            }        
        },

        mounted () {
            this.loading = true
            axios
              .get(server + '/foods')
              .then(response => {
                this.foods = response.data
              })
              .catch(error => {
                this.handleServerError(error)
              })
              .finally(() => this.loading = false)
          }
    }
)