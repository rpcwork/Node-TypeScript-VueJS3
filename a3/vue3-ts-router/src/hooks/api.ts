import { ref } from "vue";

/**
 * Function: useApi() uses async native fetch
 * 
 * @param {RequestInfo} url  required: API URL to call
 * @param {RequestInit} options optional: request parameters
 *   
 * @returns:  objects { response, request  }
 * 
 * 
 */
export default function useApi (url: RequestInfo, options?: RequestInit | undefined){
  const response = ref();
  const request = async () => {
    const res = await fetch(url, options);
    const data = await res.json();
    response.value = data;
  };
  return { response, request };
}