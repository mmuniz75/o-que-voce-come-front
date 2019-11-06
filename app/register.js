//server = 'http://localhost:5000';

server = 'http://35.229.29.128:5000';

new Vue(
    {
        el: '#app',
        data: {
            brands: [],
            foods: [],
            allChemicals : [],
            selectedBrand : 0,
            selectedFood : 0,
            loading: false,
            errored: false,
            noChemical: false,
            message: '',
            inputFood: '',
            inputBrand: '',
            inputBarCode: '',
            selectedChemicals: []
        },
        methods: {
            loadChemicals(){
                if(this.allChemicals.length > 0)
                    return;

                this.loading = true
                axios
                .get(server + '/chemicals')
                .then(response => {
                  this.allChemicals = response.data
                })
                .catch(error => {
                  this.handleServerError(error)
                })
                .finally(() => this.loading = false)
            },
            loadBrands(){
              axios
              .get(server + '/brands')
              .then(response => {
                this.brands = response.data
                this.loadChemicals();
              })
              .catch(error => {
                this.handleServerError(error)
              })
            },
            saveFood(){
              $('#cadastroAlimentoModal').modal('hide')
              this.loading = true
              axios
              .post(server + '/foods',{name : this.inputFood})
              .then(response => {
                this.message = "Alimento Cadastrado"
                this.errored = false
                $('#dialogModal').modal('show')
                this.inputFood = ''
                this.foods.push(response.data)
                this.foods.sort(this.compare);
              })
              .catch(error => {
                this.handleServerError(error)
              })
              .finally(() => {
                this.loading = false
              }  
              )
            },
            saveBrand(){
              $('#cadastroMarcaModal').modal('hide')
              this.loading = true
              axios
              .post(server + '/brands',{name : this.inputBrand})
              .then(response => {
                this.message = "Marca Cadastrada"
                this.errored = false
                $('#dialogModal').modal('show')
                this.inputBrand = ''
                this.brands.push(response.data)
                this.brands.sort(this.compare);
              })
              .catch(error => {
                this.handleServerError(error)
              })
              .finally(() => {
                this.loading = false
              }  
              )
            },
            saveChemicals(){
              this.loading = true
              axios
              .post(server + '/brands/' + this.selectedBrand + '/foods/' + this.selectedFood,{'bar-code' : this.inputBarCode,'chemicals' : this.selectedChemicals})
              .then(response => {
                this.inputBarCode = ''
                this.updateSelectedChemicals()
                this.selectedChemicals = []
                this.noChemical = false
              })
              .catch(error => {
                this.handleServerError(error)
              })
              .finally(() => {
                this.loading = false
              }  
              )
            },
            updateSelectedChemicals(){
              this.chemicals = [];
              for (checmicalId in this.selectedChemicals)
                this.chemicals.push(this.allChemicals.filter(chemical => chemical.id == this.selectedChemicals[checmicalId])[0].name)

                this.chemicals.sort()
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
            closeRegister() {
              document.location.href="index.html";
            }
        },
        
        mounted () {
            this.loading = true
            axios
              .get(server + '/foods')
              .then(response => {
                this.foods = response.data
                this.loadBrands();
              })
              .catch(error => {
                this.handleServerError(error)
              })
          }
    }
)