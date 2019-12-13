//server = 'http://localhost:5000';

server = 'http://52.247.220.130:5000';

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
            selectedChemicals: [],
            fromSelection: false
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
                this.chemicals = response.data.chemicals
                this.inputBarCode = response.data['bar_code']
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
            inputBarCode: function(){
              this.chemicals = []

              if (this.inputBarCode.length==0)
                return;
              
              if (this.inputBarCode.length<13) {
                this.brands = []
                this.selectedBrand = 0

                if(!this.fromSelection) {
                  this.selectedFood = 0
                }
                this.fromSelection = false    
                return;
              }  
              
              this.fromSelection = false
            
              this.loading = true
              axios
              .get(server + '/brands/foods/' + this.inputBarCode)
              .then(response => {
                this.selectedFood = response.data.foodId
                this.selectedBrand = response.data.brandId
                this.loadFoodBrandChemicals();
              })
              .catch(error => {
                this.brands = []
                this.selectedBrand = 0
                this.selectedFood = 0
                this.handleServerError(error)
              })  
              .finally(() => this.loading = false)
            },
            selectedFood: function(){
              this.inputBarCode = "";
              this.selectedBrand=0;
              if(this.selectedFood==0)
                  return;

              this.fromSelection = true
                                
              this.loadBrands();
            },
            selectedBrand: function(){
              this.inputBarCode = "";
              if(this.selectedBrand==0 || this.selectedFood==0 || this.brands.length == 0)
                    return;
              try{      
                barCode = this.brands.filter(b => b.brandId === this.selectedBrand)[0].barCode
                this.inputBarCode = barCode
              }catch(e){
                this.handleServerError(e)
              }
              
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