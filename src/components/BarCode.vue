<template>
  <div>
        <input class="form-control form-control-lg mb-3 mt-3 col-12" 
                     type="tel" placeholder="Código de barras" 
                     @focus="focus"
                     v-model="inputBarCode" maxlength="13">
         <spinner :loading="loading" />            
  </div>                   
</template>

<script>
  import handleResponseError from '../funcs'
  import axios from 'axios'

  export default {
    data: function () {
          return {
            loading: false,
            inputBarCode: '',
          }
    },        
    props: {
      exists: Boolean,
      load: Boolean,
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
          })
          .finally(() => (this.loading = false));
      }
    },
    watch: {
          value : function(){
             this.inputBarCode = this.value 
          },
          inputBarCode: function(){
            if(!this.load && !this.exists)
               return
            const isValid = this.inputBarCode.length==13
            this.$emit('onChange',isValid);
            if (!isValid)
              return;

            if(this.exists) {
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
    }       
  }
</script>


