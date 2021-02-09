import useApi from "@/hooks/api";
import { ref } from "vue";
import LookupError from  "@/hooks/LookupError";


/**
 * Function: incrementPageHitsViaAPI() 
 * 
 * @param {string} pagename  required: name of the page for which to increment hits via API
 *   
 * @returns: json { responsefromapi } or throws error
 * 
 */
export default async function incrementPageHitsViaAPI(pagename: string){
  try {  
    const { response: responsefromapi, request } = useApi(
        "http://69.87.218.194:3000/incrementpagehit"
        , {
          method: 'post',
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          },
          body: '{ "page": "' + pagename + '" }'
          }
      );
      
      await request();
      return { responsefromapi };
  
  }catch(e) {
    if(e instanceof Error) {
        // To do: Log error to Sentry logging service for triage and notification
        return new LookupError("Failure updating page hits via API" + e.stack);
    }
    else {
        // To do: Log error to Sentry logging service for triage and notification
        // if error is of unknown type, throw it so that caller can handle it
        throw e;
    }
  }finally {
    // free resources 
  }
  
}