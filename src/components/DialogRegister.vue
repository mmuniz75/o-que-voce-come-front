<template>
   <div
      class="modal fade"
      :id="domain"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      data-backdrop="static" data-keyboard="false"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Cadastrar uma {{domain}}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <label for="recipient-name" class="col-form-label">Nome da {{domain}}:</label>
                <input type="text" ref="inputField" class="form-control" @input='evt=>value=evt.target.value' v-model="text" />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="close">Close</button>
            <button
              type="button"
              @click="save"
              :disabled="value.length == 0"
              class="btn btn-primary"
            >Cadastrar</button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    props: {
      domain: String,
      show : Boolean
    },
    data : function(){
      return {
        value : '',
        text : ''
      }
    },
    watch:{
       show : function(){
          if(this.show) {
            this.text = ''
            $("#" + this.domain).modal("show");
            setTimeout(() => {
               this.$refs.inputField.focus();
            }, 500);
          }else
            $("#" + this.domain).modal("hide");    
       }
    },
    methods : {
      save(){
        this.$emit('onSave',this.value)
      },
      close(){
        this.$emit('onClose')
      }
    }
  }  
</script>
