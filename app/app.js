server = 'http://localhost:5000';

//server = 'http://35.229.29.128:5000';

new Vue(
    {
        el: '#app',
        data: {
            brands: [],
            foods: [],
            chemicals : [],
            allChemicals : [],
            isNew: false,
            selectedBrand : 0,
            selectedFood : 0,
            loading: false,
            errored: false,
            noChemical: false,
            message: 'Teste de mensagem'
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
            saveFood(){
              this.message = "Alimento Cadastrado"
              this.errored = false
              $('#cadastroAlimentoModal').modal('hide')
              $('#dialogModal').modal('show')
            },
            handleServerError(error){
              console.log(error)
              this.errored = true
              this.message = "Ocorreu um erro.Tente novamente mais tarde."
              $('#dialogModal').modal('show')
            }
        },
        watch: {
          selectedFood: function(){
                this.selectedBrand=0
                this.isNew = false
                this.brands = []
                this.chemicals = []
                if(this.selectedFood==0)
                    return;

                this.loading = true
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
            selectedBrand: function(){
                this.isNew = false
                this.chemicals = []
                if(this.selectedBrand==0)
                    return;

                this.loading = true
                axios
                .get(server + '/brands/' + this.selectedBrand + '/foods/' + this.selectedFood + '/chemicals')
                .then(response => {
                  this.chemicals = response.data
                  this.isNew = this.chemicals.length == 0
                })
                .catch(error => {
                  if(error.response.status==404) {
                    this.isNew = true
                    this.loadChemicals();
                  }else { 
                    this.handleServerError(error)
                  }  
                  
                })
                .finally(() => this.loading = false)
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