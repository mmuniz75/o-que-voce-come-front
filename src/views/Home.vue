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
       
       <message :text="message" isError="true"  @onClose="message = ''"/> 
       <spinner :loading="loading" />

  </div>
</template>

<script>
    import axios from 'axios';
    import handleResponseError from '../funcs'
    
    export default {
        data: function () {
            return {
              brands: [],
              foods: [],
              chemicals : [],
              selectedBrand : 0,
              selectedFood : 0,
              loading: false,
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
              this.message = handleResponseError(error)
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

        created () {
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


