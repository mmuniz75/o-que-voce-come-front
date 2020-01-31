<template>
    <div v-if="items.length > 0" >
           <h5 class="card-title mt-4">Produtos Quimicos desse produto :</h5>
           <span v-if="items.length > 0 && items[0] !== 'Nenhum'" class="card-title mt-4 mb-2" ><i>Click no produto para saber mais</i></span>
            <ul class="list-group list-group-flush mb-3 mt-4" v-for="(chemical, index) in items" :key="index">
                <li class="list-group-item alert-success" >
                    <a :href="googleUrl+chemical" target="_blank">
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
    data : function(){
      return {
        googleUrl : process.env.VUE_APP_GOOGLE_URL_QUERY
      }
    }
  }  
</script>
