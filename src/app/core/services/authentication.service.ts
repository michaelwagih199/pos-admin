import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


export class User {
  constructor(public status: string,) { }
}

export class JwtResponse {
  constructor( public jwttoken: string,) { }
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  baseUrl = environment.baseUrl;
  
  constructor(
    private httpClient: HttpClient
  ) {
  }
  authenticate(userName:any, password:any) {
    return this.httpClient.post<any>(this.baseUrl+'/auth/authenticateAPI', { userName, password }).pipe(
      map(
        userData => {
          if (userData.token != null) {
            sessionStorage.setItem('username', userName);
            let tokenStr = userData.token;
            sessionStorage.setItem('token', tokenStr);
            return userData;
          }
        }
      )
    );
  }
  
  isUserLoggedIn() {
    let user = sessionStorage.getItem('auth-user')
    //console.log(!(user === null))
    return !(user === null)
  }
 
}
