import { Component, OnInit } from '@angular/core';
import { NewsDatabase } from '../news.database';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { idShortener } from '../utils/utils';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  loginForm: FormGroup;


  constructor(private newsDB: NewsDatabase, private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {  
    // Creating a login form
    this.loginForm = this.fb.group({
      apiKey: this.fb.control('', [ Validators.required, Validators.minLength(32), Validators.maxLength(32) ])
    })
  }

  async onLogin() {
    let loginCreds = idShortener(this.loginForm.value.apiKey);
 
    console.info('>>> Your login creds: ', loginCreds);

    let isAuthenticated = await this.newsDB.getApiKey(loginCreds);

    if (isAuthenticated) {
      console.log(isAuthenticated)
      // saving user as active user in LS (active session) // 2911
      localStorage.setItem('token', isAuthenticated.apiKeyValue);
      this.router.navigate(['countries-list']);
    }
    else {
      this.router.navigate(['settings']);
    };
  };
};
