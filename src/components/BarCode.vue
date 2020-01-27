<template>
  <div>
        <input class="form-control form-control-lg mb-3 mt-3 col-12" 
                     type="tel" placeholder="Código de barras" 
                     @focus="focus"
                     v-model="inputBarCode" maxlength="13">
         <spinner :loading="loading" />            
         <message :text="message" isError="true"  @onClose="message = ''"/> 
  </div>                   
</template>

<script>
  import handleResponseError from '../funcs'
  import axios from 'axios';

  export default {
    data: function () {
          return {
            loading: false,
            inputBarCode: '',
            message: ''
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
      }
    },
    watch: {
          value : function(){
             this.inputBarCode = this.value 
          },
          inputBarCode: function(){
            if(!this.load)
               return
            const isValid = this.inputBarCode.length==13
            this.$emit('onChange',isValid);
            if (!isValid)
              return;
                        
            this.loading = true
            axios
            .get(process.env.VUE_APP_SERVER + '/brands/foods/' + this.inputBarCode)
            .then(response => {
              this.$emit('onLoadIDs', {brandId : response.data.brandId,foodId : response.data.foodId});
            })
            .catch(error => {
              this.loading = false
              this.message = handleResponseError(error)
            })  
            .finally(() => this.loading = false)
          }
    }       
  }
</script>


