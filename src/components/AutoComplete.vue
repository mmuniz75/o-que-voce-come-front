<template>
   <div>
        <vue-bootstrap-typeahead
          :data="items"
          v-model="selectedValue"
          size="lg"
          :minMatchingChars="0"
          inputClass="form-control form-control-lg mb-3 mt-3"
          :serializer="s => s.name"
          :placeholder="'Escolha o ' + domain"
          :external="selectedValue"
          @click="click"
          @hit="selectValue($event)"
        >                
        <template slot="append">
          <button class="btn btn-lg shadow-none" 
                  v-if="add" 
                  @click="showDialog=true">
            <i class="fa fa-plus"></i>
          </button>
        </template>
      
        </vue-bootstrap-typeahead>
        
      <dialog-register :domain="domain" :show="showDialog" @onClose="showDialog=false" @onSave="save($event)" />    
   </div>       
</template>

<script>
  import dialogRegister from '../components/DialogRegister'
  import {eventBus} from '../main'
  
  export default {
    components : {
        dialogRegister,
        VueBootstrapTypeahead
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
        selectedValue : "",
      }
    },
    watch :{
      selectedValue: function(){
        if(this.selectedValue=='' || this.items.filter(f => f.name === this.selectedValue).length==0)
            this.$emit('onSelected',0)
      },
      value : function() {
        if(this.items.length==0)
             return

        if(this.value == 0) {    
          this.selectedValue = ""
          return
        }  

        const names = this.items.filter(f => f.id === this.value)
        if(names.length > 0)
          this.selectedValue = names[0].name
      }
    },
    methods : {
      save(item){
        this.showDialog = false
        this.$emit('onSave',item)
      },
      selectValue(food){
          if(this.items.length==0)
             return
          
          this.$emit('onSelected',food.id)
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

