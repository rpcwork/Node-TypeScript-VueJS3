<template>
  <div class="page2">
    <h1>This is Page 2</h1>

  <br><br>
  <Counter />  
  <br><br>
  <router-link to="/home" tag="button" class="btn">Previous</router-link>
    
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import Counter from '@/components/Counter.vue'; // @ is an alias to /src

@Options({
  components: {
    Counter,
  },
})

export default class Page2 extends Vue {}
</script>

