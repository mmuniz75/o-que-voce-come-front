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
          <input
            class="form-control form-control-lg mb-3 col-11 mt-3"
            type="tel"
            placeholder="Código de barras"
            v-model="inputBarCode"
            maxlength="13"
          />

          <div class="form-inline mb-3 mt-3">
            <select class="form-control form-control-lg col-11 mr-2" v-model="selectedFood">
              <option value="0">Escolha o Alimento</option>
              <template v-for="(food, index) in foods">
                <option :value="food.id" :key="index">{{food.name}}</option>
              </template>
            </select>
            <button
              class="btn btn-lg shadow-none p-0 m-0"
              data-toggle="modal"
              data-target="#cadastroAlimentoModal"
              data-whatever="@mdo"
            >
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
            <button
              class="btn btn-lg shadow-none p-0 m-0"
              data-toggle="modal"
              data-target="#cadastroMarcaModal"
              data-whatever="@mdo"
            >
              <i class="fa fa-plus b-0"></i>
            </button>
          </div>

          <div class="card mb-3" style="width: 20rem;">
            <div class="card-body">
              <h5 class="card-title mb-4">Adicione os Produtos Quimicos</h5>

              <div class="custom-control custom-checkbox mb-4">
                <input
                  @click="noChemical=!noChemical"
                  type="checkbox"
                  class="custom-control-input"
                  id="customControlValidation1"
                  v-model="selectedChemicals"
                  value="0"
                />
                <label class="custom-control-label alert-success" for="customControlValidation1">
                  <b>Nenhum</b>
                </label>
              </div>
              <div
                class="custom-control custom-checkbox mb-4"
                v-for="(chemical,index) in allChemicals"
                :key="index"
              >
                <template v-if="!noChemical">
                  <input
                    type="checkbox"
                    v-model="selectedChemicals"
                    class="custom-control-input"
                    :id="index"
                    :value="chemical.id"
                  />
                  <label class="custom-control-label" :for="index">{{chemical.name}}</label>
                </template>
              </div>
            </div>
          </div>

          <button
            class="btn btn-primary btn-lg btn-block mt-5 mb-5"
            type="button"
            data-toggle="modal"
            data-target="#cadastradoModal"
            @click="saveChemicals"
            :disabled="inputBarCode.length < 13 || selectedChemicals.length == 0"
          >Cadastrar</button>
        </div>
      </div>
    </div>

    <div
      class="modal fade"
      id="dialogModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalCenterTitle"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">{{errored ? 'Aviso':'Confirmação'}}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body text-center">
            <div
              :class="{'alert alert-success': !errored,'alert alert-danger': errored}"
              role="alert"
            >
              <h4>{{message}}</h4>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="modal fade"
      id="cadastroMarcaModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Cadastrar uma marca</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <label for="recipient-name" class="col-form-label">Nome da Marca:</label>
                <input type="text" class="form-control" id="brandInput" v-model="inputBrand" />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button
              type="button"
              @click="saveBrand"
              :disabled="inputBrand.length == 0"
              class="btn btn-primary"
            >Cadastrar</button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="modal fade"
      id="cadastroAlimentoModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Cadastrar um alimento</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <label for="recipient-name" class="col-form-label">Nome do Alimento:</label>
                <input type="text" class="form-control" id="foodInput" v-model="inputFood" />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button
              type="button"
              @click="saveFood"
              :disabled="inputFood.length == 0"
              class="btn btn-primary"
            >Cadastrar</button>
          </div>
        </div>
      </div>
    </div>

    <spinner :loading="loading" />

  </div>
</template>

<script>
  import axios from "axios";

  export default {
    data: function() {
      return {
        brands: [],
        foods: [],
        allChemicals: [],
        selectedBrand: 0,
        selectedFood: 0,
        loading: false,
        errored: false,
        noChemical: false,
        message: "",
        inputFood: "",
        inputBrand: "",
        inputBarCode: "",
        selectedChemicals: [],
        server : process.env.VUE_APP_SERVER
      };
    },
    methods: {
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
      saveFood() {
        $("#cadastroAlimentoModal").modal("hide");
        this.loading = true;
        axios
          .post(this.server + "/foods", { name: this.inputFood })
          .then(response => {
            this.inputFood = "";
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
      saveBrand() {
        $("#cadastroMarcaModal").modal("hide");
        this.loading = true;
        axios
          .post(this.server + "/brands", { name: this.inputBrand })
          .then(response => {
            this.inputBrand = "";
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
            this.noChemical = false;
            this.message = "Alimento Cadastrado";
            this.errored = false;
            $("#dialogModal").modal("show");
          })
          .catch(error => {
            this.handleServerError(error);
          })
          .finally(() => {
            this.loading = false;
          });
      },
      handleServerError(error) {
        this.loading = false;
        console.log(error);
        this.errored = true;
        if (error.response && error.response.data && error.response.data.message)
          this.message = error.response.data.message;
        else this.message = "Ocorreu um erro.Tente novamente mais tarde.";
        $("#dialogModal").modal("show");
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
            $("#dialogModal").modal("show");
            this.selectedBrand = 0;
            this.selectedFood = 0;
          })
          .catch(error => {
            if (error.response.status != 404) this.handleServerError(error);
          })
          .finally(() => (this.loading = false));
      }
    },
    watch: {
      inputBarCode: function() {
        if (this.inputBarCode.length < 13) {
          return;
        }

        this.loading = true;
        axios
          .get(this.server + "/brands/foods/" + this.inputBarCode)
          .then(response => {
            this.errored = true;
            this.message = "Codigo de barra já cadastrado";
            $("#dialogModal").modal("show");
            this.inputBarCode = "";
          })
          .catch(error => {
            if (error.response.status != 404) this.handleServerError(error);
          })
          .finally(() => (this.loading = false));
      },
      selectedFood: function() {
        if (this.selectedBrand == 0 || this.selectedFood == 0) return;
        this.checkAlreadyExists();
      },
      selectedBrand: function() {
        if (this.selectedBrand == 0 || this.selectedFood == 0) return;
        this.checkAlreadyExists();
      }
    },

    mounted() {
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
