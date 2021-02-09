// Big thanks to: https://github.com/pottereric/TypeScriptErrorHandling

/**
 * Class LookupError() 
 * 
 * The class whose instance is returned if there is failure in API calls
 * 
 */
export default class LookupError {
    readonly kind: string = "Lookup Failed";
    constructor(public reason: string) { }
}
