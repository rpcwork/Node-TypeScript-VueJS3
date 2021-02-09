<template>
  <div class="home">
    <h1>This is Page 1</h1>

  <br><br>
  <Counter />  
  <br><br>

    <router-link to="/page2" tag="button" class="btn">Next</router-link>
    
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

export default class Home extends Vue {}
</script>