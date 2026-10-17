import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [ReactiveFormsModule, FormsModule]
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private tokenStorage = inject(TokenStorageService);
  private router = inject(Router);

  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      // this.roles = this.tokenStorage.getUser()?.roles;
    }
  }

  onSubmit() {
    
    this.authService.login(this.form).subscribe(
      data => {
       
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        // this.roles = this.tokenStorage.getUser().roles;
        this.reloadPage();
      },
      err => {
        
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }

  reloadPage() {
   // window.location.reload();
    this.router.navigateByUrl('/home');

  }

}
