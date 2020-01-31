<template>
    <div v-if="items.length > 0" >
           <h5 class="card-title mt-4">Produtos Quimicos desse produto :</h5>
           <span v-if="hasChemical()" class="card-title mt-4 mb-2" ><i>Click no produto para saber mais</i></span>
            <ul class="list-group list-group-flush mb-3 mt-4" v-for="(chemical, index) in items" :key="index">
                <li class="list-group-item alert-success" >
                    <a href="#" @click="getHref(chemical)">
                    <span :class="chemical=='Nenhum'?'alert-success font-weight-bold':''">{{chemical}}</span>
                    </a>
                </li>
            </ul>
    </div>
</template>

<script>
  export default {
    props: {
      items: Array
    },
    methods : {
      getHref(chemical) {
        if (this.hasChemical()) {
          window.open(process.env.VUE_APP_GOOGLE_URL_QUERY + chemical)
        }else {
          return false  
        }  
      },
      hasChemical(){
        return this.items.length > 0 && this.items[0] !== 'Nenhum'
      }
    }
  }  
</script>
