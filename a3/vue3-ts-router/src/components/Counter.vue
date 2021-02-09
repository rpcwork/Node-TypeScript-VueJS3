<template>
  <div class="counter">
    
    <Suspense>
      <template #default>
         <h1>Display Hits: {{ hitcount }}</h1>
      </template>
      <template #fallback>
        <div>Loading...</div>
      </template>
    </Suspense>
    
  </div>
</template>

<script lang="ts">
import store from '@/store'
import { ref, onMounted, defineComponent } from "vue";
import { useRoute } from 'vue-router';
import PageHits from "@/hooks/gethits";
import getPageHitsFromAPI from "@/hooks/gethits";
import incrementPageHitsViaAPI from "@/hooks/incrementhits";
import LookupError from  "@/hooks/LookupError";

/**
 * Counter Component
 * 
 * */
export default defineComponent({
  name: 'Counter',
  setup() {
    const route = useRoute();
    const routename =  route.name?route.name:'home';
    const hitcount = ref(null);
    // eslint-disable-next-line
    const totalhitcount = ref(null);
    
    /**
     * Function: currentroute()
     * 
     * @param none 
     * @returns: current page route name converted to a string
     * 
     */
    function currentroute(){
      return String(routename);
    }


    /**
     * Function: fetchHitsFromAPI()
     * 
     * @param none 
     * @returns: boolean true
     * 
     */
    async function fetchHitsFromAPI() {
      // if our local source of truth tells us that we have alreayd loaded page hits data 
      // from the API, no need to do it again
      if( 'yes' == store.getters.getapidataloaded){
        return true;
      }
      
      try {
        const pagehitsfromapi = await getPageHitsFromAPI<typeof PageHits[]>();
        
        if(pagehitsfromapi instanceof LookupError){
          // we can't retrieve from API, fallback to to vuex store
          hitcount.value = store.getters.getpagehits[currentroute()];
        }else if(pagehitsfromapi instanceof Error){
          // we can't retrieve from API, fallback to to vuex store
          hitcount.value = store.getters.getpagehits[currentroute()];
        }else{
            pagehitsfromapi.res.forEach(function (key: any) {
              store.commit('updatehit', { pagename: key.pagename, hits: key.pagehits });
              store.commit('markapidataloaded', 'yes');
          });
        }
      }catch (e){
        // To do: Log error to Sentry logging service for triage and notification
        // fallback to to vuex store
        hitcount.value = store.getters.getpagehits[currentroute()];
      }

      return true;
    }

    
     /**
     * Function: onMounted()
     * 
     * @param none 
     * @returns: data to Vue Page State { hitcount, currentroute }
     * 
     * Hook into the new Vue3 component life cycle method onMounted (this was mounted in Vue2.*)
     * Calls fetchHitsFromAPI, then calls incrementPageHitsViaAPI and finally increments store page hits and 
     * the count display in the component UI
     * 
     */
    onMounted(() => {
      
      fetchHitsFromAPI()
      .then(() => {
         incrementPageHitsViaAPI(currentroute()); 
      })
      .then(() => {
        store.commit('incrementhit', currentroute());
        hitcount.value = store.getters.getpagehits[currentroute()];
      })
      .catch(error => {
        if(error instanceof LookupError){
          // To do: Log error to Sentry logging service for triage and notification
          // fallback to to vuex store
          hitcount.value = store.getters.getpagehits[currentroute()];
        }else if(error instanceof Error){
          // To do: Log error to Sentry logging service for triage and notification
          // fallback to to vuex store
          hitcount.value = store.getters.getpagehits[currentroute()];
        }
      })
      .finally(
        // free up resources
      );
    }); // end of onmounted
    
    return {
      hitcount,
      currentroute
    }

  } // end of setup
}); // end of export

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
