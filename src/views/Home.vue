<template>
    <div>
       <div class="container">
            <div class="my-5 text-center text-light">
                <h2>O QUE VOCÊ COME ?</h2>
                <p>Veja os produtos quimicos que acompanham os alimentos que você consome.</p>
            </div>
            <div class="row justify-content-center">
                <div class="col-lg-6" style="background-color:#ffffff">

                    <input class="form-control form-control-lg mb-3 mt-3 col-12" type="tel" placeholder="Código de barras"
                     v-model="inputBarCode" maxlength="13">

                    <div class="mb-3  mt-3" >
                        <select class="form-control form-control-lg col-12 mr-2" v-model="selectedFood">
                            <option value="0">Escolha o Alimento</option>
                            <template v-for="(food, index) in foods">
                                <option :value="food.id" :key="index" >{{food.name}}</option>
                            </template>
                        </select>
                    </div>
                    <div class="mb-3" v-if="selectedFood!=0">
                        <select class="form-control form-control-lg col-12 mr-2" v-model="selectedBrand">
                            <option value="0">Escolha a Marca</option>
                            <template v-for="(brand, index) in brands">
                                <option :value="brand.brandId" :key="index">{{brand.brand}}</option>
                            </template>
                        </select>
                    </div>

                    <template v-if="chemicals.length > 0">
                        <h5 class="card-title mb-4 mt-4">Produtos Quimicos desse produto</h5>
                        <ul class="list-group list-group-flush mb-3" v-for="(chemical, index) in chemicals" :key="index">
                            <li class="list-group-item alert-success" >
                               <span :class="chemical=='Nenhum'?'alert-success font-weight-bold':''">{{chemical}}</span>
                            </li>
                        </ul>
                    </template>

                    <button v-if="chemicals.length == 0" class="btn btn-primary btn-lg btn-block mt-5 mb-5"
                        type="button" @click="openRegister()" >Não achei o meu alimento</button>
                </div>
            </div>

        </div>
       
        <div class="modal fade" id="dialogModal" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">{{errored ? 'Aviso':'Confirmação'}}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body text-center">
                        <div :class="{'alert alert-success': !errored,'alert alert-danger': errored}" role="alert">
                            <h4 >{{message}}</h4>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="gray d-flex justify-content-center" v-if="loading">
            <div class="spinner-border text-light spinner-center" role="status" >
                <span class="sr-only">Loading...</span>
            </div>
        </div>

  </div>
</template>

<script>
    import axios from 'axios';
    
    export default {
        data: function () {
            return {
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
              fromSelection: false,
              server : process.env.VUE_APP_SERVER
            }
        },
        methods: {
            loadBrands(){
              axios
              .get(this.server + '/foods/' + this.selectedFood + '/brands')
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
              .get(this.server + '/brands/' + this.selectedBrand + '/foods/' + this.selectedFood + '/chemicals')
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
              this.$router.push('/register')
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
              .get(this.server + '/brands/foods/' + this.inputBarCode)
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
                const barCode = this.brands.filter(b => b.brandId === this.selectedBrand)[0].barCode
                this.inputBarCode = barCode
              }catch(e){
                this.handleServerError(e)
              }
              
            }  
        },

        mounted () {
            this.loading = true
            axios
              .get(this.server + '/foods')
              .then(response => {
                this.foods = response.data
              })
              .catch(error => {
                this.handleServerError(error)
              })
              .finally(() => this.loading = false)
          }
    }
</script>

<style>
  .custom-control-label::before,
  .custom-control-label::after {
      top: -0.3rem;
      left: -2.5rem;
      width: 2rem;
      height: 2rem;
  }

  .gray {
      position: fixed; /* Stay in place */
      z-index: 1; /* Sit on top */
      left: 0;
      top: 0;
      width: 100%; /* Full width */
      height: 100%; /* Full height */
      overflow: auto; /* Enable scroll if needed */
      background-color: rgb(0,0,0); /* Fallback color */
      background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
  }

  .spinner-center {
      position: fixed;
      top: calc(50% - 3rem);
      z-index: 10000;
      width: 3rem; 
      height: 3rem
  }

  #btnClose {
      box-shadow: none;
      outline: none;
  }
</style>
