import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiKey } from '../models';
import { NewsDatabase } from '../news.database';
import { idShortener, removeValidators, addValidators } from '../utils/utils';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  // For form validation
  validationType: {} = {
    apiKeyValue: [ Validators.required ],
  }

  settingsForm: FormGroup;
  
  constructor(private fb: FormBuilder, private router: Router, private newsDB: NewsDatabase ) { }

  ngOnInit(): void {
    this.settingsForm = this.fb.group({
      apiKeyValue: this.fb.control('', [ Validators.required, Validators.minLength(32), Validators.maxLength(32) ])
    })
  }

  async onSave() {
    // Get API Key from form
    let apiKeyValue:string = this.settingsForm.value.apiKeyValue;
    
    // Make the first 16 chars the index in the DB
    let id: string =  idShortener(apiKeyValue);

    // apiKey Object with ApiKey Type
    let apiKeyObj: ApiKey = {
      id,
      apiKeyValue,
    };

    // Saving to DB
    console.info('>>> Saving API key to DB')  
    await this.newsDB.saveApiKey(apiKeyObj) // this returns a promise
      .then(res => {
        console.info('Successfully added API key to DB.');
        localStorage.setItem('token', apiKeyValue);
      })
      .catch((err) => {
        console.error(`${err.name}: ${err.message}`)}
      )
  };

  // Go back to countries list page
  onBack() {
    this.settingsForm.reset();
    removeValidators(this.settingsForm);
    addValidators(this.settingsForm, this.validationType);
    this.router.navigate(['countries-list']);
  }

  // Delete API key from DB
  async onDelete() {
    let id: string =  idShortener(this.settingsForm.value.apiKeyValue);
    await this.newsDB.deleteApiKey(id)
      .then(() => 'Successfully deleted API key from DB')
      .catch(err => {
        console.error(`${err.name}: ${err.message}`)
      })
  }
}
