import useApi from "@/hooks/api";
import { ref } from "vue";
import LookupError from  "@/hooks/LookupError";


/**
 * Class PageHits
 * 
 * The class to which the API response object array is formatted to
 */
export class PageHits {
  pagename: string;
  pagehits: number;

  constructor(pagename: string, pagehits: number) {
    this.pagename = pagename;
    this.pagehits = pagehits;
  }
}



/**
 * Function: formatPageHits() 
 * 
 * @param {PageHits} pageitem  required: API URL to call
 *   
 * @returns: json array { pagename: pageitem.pagename, pagehits: pageitem.pagehits }
 * 
 */
function formatPageHits(pageitem: PageHits): PageHits {
  return { pagename: pageitem.pagename, pagehits: pageitem.pagehits };
}




/**
 * Function: getPageHitsFromAPI<T>() 
 * 
 * @param {PageHits} pageitem  required: API URL to call
 *   
 * @returns: response objects formatted to PageHits class instances or error
 * 
 * Calls useApi to get page hits and then maps over the response array of objects 
 * and finally returns response
 */
export default async function getPageHitsFromAPI<T>(){
  
  try {
    const { response: pagehitsfromapi, request } = useApi(
      "http://69.87.218.194:3000/getpagehits"
    );

    const loaded = ref(false);
    if (loaded.value === false) {
      await request();
      loaded.value = true;
    }

    try {
      const res = pagehitsfromapi.value.map((pageitem: PageHits) => formatPageHits(pageitem));

      return { res };
    }catch(e) {
      if(e instanceof Error) {
          // To do: Log error to Sentry logging service for triage and notification
          // return error 
          return new LookupError("Error mapping response to expected array of instances. Got illformed response from API. Error stack: " + e.stack);
      }
      else {
          // To do: Log error to Sentry logging service for triage and notification
          // if error is of unknown type, throw it so that caller can handle it
          throw e;
      }
    }

  }catch(e) {
    if(e instanceof Error) {
        // To do: Log error to Sentry logging service for triage and notification
        // return error 
        return new LookupError("Failure getting page hits from API. Error stack: " + e.stack);
    }
    else {
        // To do: Log error stack to Sentry logging service for triage and notification
        // if error is of unknown type, throw it so that caller can handle it
        throw e;
    }
  }finally {
    // free resources 
  }
  
  
}
