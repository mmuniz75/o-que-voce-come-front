<template>
    <div v-if="items.length > 0" >
           <h5 class="card-title mb-4 mt-4">Produtos Quimicos desse produto</h5>
            <ul class="list-group list-group-flush mb-3" v-for="(chemical, index) in items" :key="index">
                <li class="list-group-item alert-success" >
                    <span :class="chemical=='Nenhum'?'alert-success font-weight-bold':''">{{chemical}}</span>
                </li>
            </ul>
    </div>
</template>

<script>
  export default {
    props: {
      items: Array
    }
  }  
</script>
