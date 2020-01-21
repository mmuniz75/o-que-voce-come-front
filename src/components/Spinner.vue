<template>
   <div class="gray d-flex justify-content-center" v-if="loading">
      <div class="spinner-border text-light spinner-center" role="status" >
          <span class="sr-only">Loading...</span>
      </div>
  </div>
</template>

<script>
  export default {
    props: {
      loading: Boolean
    }
  }  
</script>

<style>
  .gray {
      position: fixed; /* Stay in place */
      z-index: 1; /* Sit on top */
      left: 0;
      top: 0;
      width: 100%; /* Full width */
      height: 100%; /* Full height */
      overflow: auto; /* Enable scroll if needed */
      background-color: rgb(0,0,0); /* Fallback color */
      background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
  }

  .spinner-center {
      position: fixed;
      top: calc(50% - 3rem);
      z-index: 10000;
      width: 3rem; 
      height: 3rem
  }

  #btnClose {
      box-shadow: none;
      outline: none;
  }
</style>