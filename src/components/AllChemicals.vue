<template>
    <div>
        <div class="card mb-3" style="width: 20rem;">
            <div class="card-body">
              <h5 class="card-title mb-4">Adicione os Produtos Quimicos</h5>

              <div class="custom-control custom-checkbox mb-4">
                <input
                  @click="hasItem=!hasItem"
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
              <template v-if="hasItem">
                  <div class="custom-control custom-checkbox mb-4"
                    v-for="(chemical,index) in items" :key="index">
                      <input
                        type="checkbox"
                        v-model="selectedChemicals"
                        class="custom-control-input"
                        :id="index"
                        :value="chemical.id"
                      />
                      <label class="custom-control-label" :for="index">{{chemical.name}}</label>
                  
                  </div>
              </template>
            </div>
          </div>
          <span class="card-title mt-4 mb-2" ><i>Não achou um químico? <a href="mailto:betterworldemail@gmail.com">Solicite aqui</a></i></span>
  </div>                   
</template>

<script>
  import {eventBus} from '../main'

  export default {
    props: {
      items: Array
    },
    data: function() {
      return {
        selectedChemicals: [],
        hasItem: true
      }
    },
    watch : {
      selectedChemicals : function() {
          this.$emit('selections',this.selectedChemicals)
      }
    },
    created() {
        eventBus.$on('clearInputs', () => {
            this.hasItem = true;
            this.selectedChemicals = []
        })
    }
  }  
</script>
