import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const USER_PERMISSION_KEY = 'auth-permission';
const USER_NAME_KEY = 'userName';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  signOut() {
    window.sessionStorage.clear();
  }

  public saveToken(token: string) {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): any{
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user:any) {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    window.sessionStorage.setItem(USER_NAME_KEY, JSON.stringify(user.username));
    window.sessionStorage.setItem(USER_PERMISSION_KEY, JSON.stringify(user.permissions[0]));
  }

  public getUser(){
    return sessionStorage.getItem("USER_KEY")
  }
}
