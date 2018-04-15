import http from "./core/http";
import { AxiosResponse } from "axios";

import { LoginInfo } from "../models/login-model";
import { UserProfile } from "../models/user-profile";

class AuthenticationService {
    private static readonly CURRENT_USER_KEY = 'currentUser';
    private callbacks: ((isLoggedIn: boolean) => void)[] = [];

    constructor() { 
        this.handleResponse = this.handleResponse.bind(this);
    }

    addCallback = (callback: (isLoggedIn: boolean) => void) => {
        this.callbacks.push(callback);
    }

    removeCallback = (callback: (isLoggedIn: boolean) => void) => {
        const index = this.callbacks.findIndex(x => x === callback);
        if (index !== -1) {
            this.callbacks.splice(index, 1);
        }
    }

    get userProfile(): UserProfile {
        const value = localStorage.getItem(AuthenticationService.CURRENT_USER_KEY);
        if (value) {
            return JSON.parse(value);
        } else {
            return null;
        }
    }

    get isLoggedIn(): boolean {
        return this.userProfile !== null;
    }

    set userProfile(value: UserProfile) {
        const isLoggedIn: boolean = value !== null;
        
        if (isLoggedIn) {
            localStorage.setItem(AuthenticationService.CURRENT_USER_KEY, JSON.stringify(value));
        } else {
            localStorage.removeItem(AuthenticationService.CURRENT_USER_KEY);
        }

        for (const callback of this.callbacks) {
            callback(isLoggedIn);
        }
    }
  
    login(model: LoginInfo) {
        return http.post<UserProfile>('home/login', model)
            .then(this.handleResponse);
    }
    
    register(model: LoginInfo) {
        return http.post<UserProfile>('home/register', model)
            .then(this.handleResponse);
    }

    logout() {
        this.userProfile = null;
        return http.post('home/logout');
    }

    private handleResponse(response : AxiosResponse<UserProfile>) : UserProfile {
        this.userProfile = response.data;
        return response.data;
    }
}

export default new AuthenticationService();
