<template>
    <div>
       <div class="container">
            <div class="my-5 text-center text-light">
                <h2>O QUE VOCÊ COME ?</h2>
                <p>Veja os produtos quimicos que acompanham os alimentos que você consome.</p>
            </div>
            <div class="row justify-content-center">
                <div class="col-lg-6" style="background-color:#ffffff">

                    <bar-code :value="inputBarCode" 
                              :loadIDs="!fromSelection" 
                              @onLoadIDs="setIds($event)" 
                              @onChange="clear($event)"
                              @onFocus="fromSelection=false"
                              @onError="message=$event"
                               />
                    
                    <auto-complete domain="Alimento" 
                              :items="foods" 
                              :value="selectedFood"
                              @click="fromSelection=true"
                              @onSelected="selectedFood=$event"/>

                    <selection domain="Marca" 
                              :items="brands"
                              :value="selectedBrand"
                              @click="fromSelection=true"
                              @onSelected="selectedBrand=$event"
                              v-if="selectedFood!=0" />

                    <chemical :items="chemicals" />

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
    import chemical from '../components/Chemical'
    
    export default {
        components : {
          chemical
        },
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
              fromSelection: true,
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
            openRegister() {
              this.$router.push('/register')
            },
            setIds(ids) {
               if(!ids) 
                  return;

               this.selectedFood = ids.foodId
               this.selectedBrand = ids.brandId
               this.loadFoodBrandChemicals() 
            },
            clear(barCode){
              if (barCode.length!=13) {
                this.chemicals = []
                this.brands = []
                this.selectedBrand = 0
                this.selectedFood = 0
              }  
            }
        },
        watch: {
            selectedFood: function(){
              if(this.fromSelection) {
                this.selectedBrand=0;
                this.inputBarCode = "";
                this.chemicals = []
              }
                
              if(this.selectedFood==0) { 
                this.brands = []
                return;
              }
                                              
              this.loadBrands();
            },
            selectedBrand: function(){
              if(this.selectedBrand==0 || this.selectedFood==0 || this.brands.length == 0) {
                  if(this.fromSelection){
                      this.chemicals = []
                      this.inputBarCode = "";
                  }
                  return;
              }      
              try{      
                const barCode = this.brands.filter(b => b.id === this.selectedBrand)[0].barCode
                this.inputBarCode = barCode
                this.loadFoodBrandChemicals()
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


