import { FormGroup } from '@angular/forms';
import { countriesCode } from '../models'; 
import { HttpParams } from '@angular/common/http';

// Get the first 16 digits to be stored as id key in DB (for ApiKey table)
export const idShortener = (apiKey: string) => apiKey.substr(0, 16);

// Remove validators from form
export const removeValidators = (form: FormGroup) => {
    for (const key in form.controls) {
        form.get(key).clearValidators();
        form.get(key).updateValueAndValidity();
    }
}

// Add validators to form
export const addValidators = (form: FormGroup, validationType:{}) => {
    for (const key in form.controls) {
        form.get(key).setValidators(validationType[key]);
        form.get(key).updateValueAndValidity();
    }
}

// Generate API query params
export const queryParams = () => {
    let cc = countriesCode.join(';');
    let qp = new HttpParams().set('codes', cc);
    return qp;
}
