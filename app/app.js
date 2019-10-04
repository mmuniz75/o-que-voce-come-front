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
            message: '',
            inputFood : ''
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
              })
              .catch(error => {
                this.handleServerError(error)
              })
              .finally(() => this.loading = false)
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
          handleServerError(error){
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
        }
        },
        watch: {
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
                this.loadBrands();
              })
              .catch(error => {
                this.handleServerError(error)
              })
          }
    }
)