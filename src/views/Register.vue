<template>
  <div>
    <div class="container">
      <button type="button" @click="closeRegister()" id="btnClose" class="close" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
      <div class="my-5 text-center text-light">
        <h2>O QUE VOCÊ COME ?</h2>
        <p>Cadastre os produtos quimicos da sua marca ou alimento.</p>
        <p>Caso não ache sua marca ou alimento aperte + para adiciona-los.</p>
      </div>
      <div class="row justify-content-center">
        <div class="col-lg-6" style="background-color:#ffffff">

          <bar-code :notExists="true" 
                    @onError="showError($event)"
                    @onChange="updateBarCode($event)"
                    @onValid="validBarCode=true" />

          <div class="form-inline mb-3 mt-3">
            <select class="form-control form-control-lg col-11 mr-2" v-model="selectedFood">
              <option value="0">Escolha o Alimento</option>
              <template v-for="(food, index) in foods">
                <option :value="food.id" :key="index">{{food.name}}</option>
              </template>
            </select>
            <button class="btn btn-lg shadow-none p-0 m-0" @click="showFoodDialog=true">
              <i class="fa fa-plus"></i>
            </button>
          </div>
          <div class="form-inline mb-3">
            <select class="form-control form-control-lg col-11 mr-2" v-model="selectedBrand">
              <option value="0">Escolha a Marca</option>
              <template v-for="(brand,index) in brands">
                <option :value="brand.id" :key="index">{{brand.name}}</option>
              </template>
            </select>
            <button class="btn btn-lg shadow-none p-0 m-0" @click="showBrandDialog=true">
              <i class="fa fa-plus b-0"></i>
            </button>
          </div>

          <all-chemicals :items="allChemicals" @selections="selectedChemicals=$event"/>

          <button
            class="btn btn-primary btn-lg btn-block mt-5 mb-5"
            type="button"
            data-toggle="modal"
            data-target="#cadastradoModal"
            @click="saveChemicals"
            :disabled="!validBarCode || selectedChemicals.length == 0 || !validFoodBrand"
          >Cadastrar</button>
        </div>
      </div>
    </div>

    <dialog-register domain="Alimento" :show="showFoodDialog" @onClose="showFoodDialog=false" @onSave="saveFood($event)" />    
    <dialog-register domain="Marca" :show="showBrandDialog" @onClose="showBrandDialog=false" @onSave="saveBrand($event)"/>    
    <message :text="message" :isError="errored" @onClose="message = ''"/>
    <spinner :loading="loading" />

  </div>
</template>

<script>
  import axios from "axios";
  import handleResponseError from '../funcs'
  import allChemicals from '../components/AllChemicals'
  import dialogRegister from '../components/DialogRegister'
  import {eventBus} from '../main'

  export default {
    components : {
        allChemicals,
        dialogRegister
    },
    data: function() {
      return {
        brands: [],
        foods: [],
        allChemicals: [],
        selectedBrand: 0,
        selectedFood: 0,
        loading: false,
        errored: false,
        message: "",
        inputFood: "",
        inputBrand: "",
        inputBarCode: "",
        selectedChemicals: [],
        server : process.env.VUE_APP_SERVER,
        validBarCode: false,
        validFoodBrand: false,
        showBrandDialog: false,
        showFoodDialog: false
      };
    },
    methods: {
      updateBarCode(barcode){
          this.inputBarCode=barcode
          this.validBarCode =  barcode.length==13
      },
      showError(errorMessage){
         this.errored = true
         this.message = errorMessage
         this.validBarCode = false 
      },
      loadChemicals() {
        if (this.allChemicals.length > 0) return;

        this.loading = true;
        axios
          .get(this.server + "/chemicals")
          .then(response => {
            this.allChemicals = response.data;
          })
          .catch(error => {
            this.handleServerError(error);
          })
          .finally(() => (this.loading = false));
      },
      loadBrands() {
        axios
          .get(this.server + "/brands")
          .then(response => {
            this.brands = response.data;
            this.loadChemicals();
          })
          .catch(error => {
            this.handleServerError(error);
          });
      },
      saveFood(food) {
        this.showFoodDialog = false
        this.loading = true;
        axios
          .post(this.server + "/foods", { name: food })
          .then(response => {
            this.foods.push(response.data);
            this.foods.sort(this.compare);
            this.selectedFood = response.data.id;
          })
          .catch(error => {
            this.handleServerError(error);
          })
          .finally(() => {
            this.loading = false;
          });
      },
      saveBrand(brand) {
        this.showBrandDialog = false
        this.loading = true;
        axios
          .post(this.server + "/brands", { name: brand })
          .then(response => {
            this.brands.push(response.data);
            this.brands.sort(this.compare);
            this.selectedBrand = response.data.id;
          })
          .catch(error => {
            this.handleServerError(error);
          })
          .finally(() => {
            this.loading = false;
          });
      },
      saveChemicals() {
        this.loading = true;
        axios
          .post(
            this.server +
              "/brands/" +
              this.selectedBrand +
              "/foods/" +
              this.selectedFood,
            { "bar-code": this.inputBarCode, chemicals: this.selectedChemicals }
          )
          .then(response => {
            this.inputBarCode = "";
            this.selectedBrand = 0;
            this.selectedFood = 0;
            this.selectedChemicals = [];
            this.errored = false;
            this.message = "Alimento Cadastrado";
            eventBus.$emit('clearInputs')
          })
          .catch(error => {
            this.handleServerError(error);
          })
          .finally(() => {
            this.loading = false;
          });
      },
      handleServerError(error) {
        this.loading = false
        this.errored = true
        this.message = handleResponseError(error)
      },
      compare(a, b) {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1;
        }
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return 1;
        }
        return 0;
      },
      closeRegister() {
        this.$router.push('/')
      },
      checkAlreadyExists() {
        this.loading = true;
        this.validFoodBrand = false
        axios
          .get(
            this.server +
              "/brands/" +
              this.selectedBrand +
              "/foods/" +
              this.selectedFood +
              "/chemicals"
          )
          .then(response => {
            this.errored = true;
            this.message = "Alimento e marca já cadastrados";
          })
          .catch(error => {
            if (error.response.status != 404) this.handleServerError(error);
            this.validFoodBrand = true
          })
          .finally(() => (this.loading = false));
      }
    },
    watch: {
      selectedFood: function() {
        if (this.selectedBrand == 0 || this.selectedFood == 0) return;
        this.checkAlreadyExists();
      },
      selectedBrand: function() {
        if (this.selectedBrand == 0 || this.selectedFood == 0) return;
        this.checkAlreadyExists();
      }
    },

    created() {
      this.loading = true;
      axios
        .get(this.server + "/foods")
        .then(response => {
          this.foods = response.data;
          this.loadBrands();
        })
        .catch(error => {
          this.handleServerError(error);
        });
    }
  };
</script>
