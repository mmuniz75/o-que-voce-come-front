<template>
  <div class="modal fade" id="dialogModal" tabindex="-1" role="dialog"
      aria-labelledby="exampleModalCenterTitle" aria-hidden="true" >
      <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
              <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">{{isError ? 'Aviso':'Confirmação'}}</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="close">
                      <span aria-hidden="true">&times;</span>
                  </button>
              </div>
              <div class="modal-body text-center">
                  <div :class="{'alert alert-success': !isError,'alert alert-danger': isError}" role="alert">
                      <h4 >{{text}}</h4>
                  </div>
              </div>
              <div class="modal-footer">
                  <button type="button" class="btn btn-primary" data-dismiss="modal" @click="close">Close</button>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
  export default {
    props: {
      text: '',
      isError: true
    },
    watch :{
      text : function(){
        if(this.text !== '')
          $('#dialogModal').modal('show')  
      }
    },
    methods : {
      close(){
        this.$emit('onClose')
      }
    }
  }  
</script>
