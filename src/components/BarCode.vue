<template>
  <div>
        <input class="form-control form-control-lg mb-3 mt-3" 
                     type="tel" placeholder="Código de barras" 
                     @focus="focus"
                     v-model="inputBarCode" maxlength="13">
         <spinner :loading="loading" />            
  </div>                   
</template>

<script>
  import handleResponseError from '../funcs'
  import axios from 'axios'
  import {eventBus} from '../main'

  export default {
    data: function () {
          return {
            loading: false,
            inputBarCode: '',
          }
    },        
    props: {
      notExists: Boolean,
      loadIDs: Boolean,
      value : ''
    },
    methods: {
      focus(){
        this.$emit('onFocus');
      },
      barCodeExists(){
        this.loading = true;
        axios
          .get(process.env.VUE_APP_SERVER + "/brands/foods/" + this.inputBarCode)
          .then(response => {
            this.$emit("onError","Codigo de barra já cadastrado");
          })
          .catch(error => {
            if (error.response.status != 404) 
             this.$emit("onError",handleResponseError(error));
            else 
             this.$emit("onValid",this.inputBarCode);
          })
          .finally(() => (this.loading = false));
      }
    },
    watch: {
          value : function(){
             this.inputBarCode = this.value 
          },
          inputBarCode: function(){
            if(!this.loadIDs && !this.notExists)
               return
            
            this.$emit('onChange',this.inputBarCode);
            if (this.inputBarCode.length!=13)
              return;

            if(this.notExists) {
              this.barCodeExists();
              return;
            }  
                        
            this.loading = true
            axios
            .get(process.env.VUE_APP_SERVER + '/brands/foods/' + this.inputBarCode)
            .then(response => {
              this.$emit('onLoadIDs', {brandId : response.data.brandId,foodId : response.data.foodId});
            })
            .catch(error => {
              this.loading = false
              this.$emit("onError",handleResponseError(error));
            })  
            .finally(() => this.loading = false)
          }
    },
    created() {
        eventBus.$on('clearInputs', () => {
            this.inputBarCode = '';
        })
    }       
  }
</script>


