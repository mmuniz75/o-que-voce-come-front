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
                    
          <auto-complete domain="Alimento" 
                        :items="foods" 
                        :value="selectedFood"
                        :add="true" 
                        @onSave="saveFood($event)" 
                        @onSelected="selectedFood=$event"/>

          <auto-complete domain="Marca" 
                        :items="brands" 
                        :value="selectedBrand"
                        :add="true" 
                        @onSave="saveBrand($event)" 
                        @onSelected="selectedBrand=$event"/>

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

    <message :text="message" :isError="errored" @onClose="message = ''"/>
    <spinner :loading="loading" />

  </div>
</template>

<script>
  import axios from "axios";
  import handleResponseError from '../funcs'
  import allChemicals from '../components/AllChemicals'
  import {eventBus} from '../main'

  export default {
    components : {
        allChemicals
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
        validFoodBrand: false
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
