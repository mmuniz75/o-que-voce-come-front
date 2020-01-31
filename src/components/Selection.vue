<template>
   <div>
    <div class="form-inline mb-3 mt-3">
        <select class="form-control form-control-lg col-12 mr-2" v-model="selectedValue" @click="click">
          <option :value="0">Escolha a {{domain}}</option>
          <template v-for="(item, index) in items">
            <option :value="item.id" :key="index">{{item.name}}</option>
          </template>
        </select>
        <button class="btn btn-lg shadow-none p-0 m-0" 
                v-if="add" 
                @click="showDialog=true">
          <i class="fa fa-plus"></i>
        </button>
    </div>
    <dialog-register :domain="domain" :show="showDialog" @onClose="showDialog=false" @onSave="save($event)" />    
   </div>       
</template>

<script>
  import dialogRegister from '../components/DialogRegister'
  import {eventBus} from '../main'

  export default {
    components : {
        dialogRegister
    },
    props: {
      value : Number,
      domain: String,
      add: Boolean,
      items: Array
    },
    data : function() {
      return {
        showDialog : false,
        selectedValue : 0
      }
    },
    watch :{
      selectedValue : function(){
          this.$emit('onSelected',this.selectedValue)
      },
      value : function() {
          this.selectedValue = this.value
      }
    },
    methods : {
      save(item){
        this.showDialog = false
        this.$emit('onSave',item)
      },
      click() {
        this.$emit('click')
      }
    },
    created() {
        eventBus.$on('clearInputs', () => {
            this.selectedValue = 0;
        })
    }   
  }  
</script>
