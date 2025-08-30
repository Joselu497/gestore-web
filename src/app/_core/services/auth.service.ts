import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  finalize,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';
import { environment } from '../../../environments/environment';

const API_LOGIN_URL = `${environment.apiUrl}/auth/login`;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _http: HttpClient = inject(HttpClient);
  private _storageService: StorageService = inject(StorageService);
  private _router: Router = inject(Router);

  currentUserSubject = new BehaviorSubject<any>(undefined);
  currentEntitySubject = new BehaviorSubject<any>(undefined);
  hasSubordinateSubject = new BehaviorSubject<boolean>(false);
  isLoadingSubject = new BehaviorSubject<boolean>(false);

  constructor() {
    this.getUserByToken().subscribe();
  }

  get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: any) {
    this.currentUserSubject.next(user);
  }

  login(data: any): Observable<any> {
    data.password = data.password || '';
    this.isLoadingSubject.next(true);
    return this._http.post<any>(API_LOGIN_URL, data).pipe(
      switchMap((auth: any) => {
        this.setLocalStorage(auth);
        return this.getUserByToken();
      }),
      finalize(() => {
        this.getUserByToken();
        this.isLoadingSubject.next(false);
      })
    );
  }

  setLocalStorage(auth: any): boolean {
    if (auth) {
      this._storageService.setStorage('access_token', JSON.stringify(auth));
      return true;
    }
    return false;
  }

  getLocalStorage(): any {
    try {
      return JSON.parse(this._storageService.getStorage('access_token') ?? '');
    } catch (error) {
      return undefined;
    }
  }

  /**
   * Get the user defined in the local storage if exists,
   * otherwise return undefined and logout the user
   * @returns An observable of the user defined in the local storage
   */
  getUserByToken(): Observable<any> {
    let obs: Observable<any>;
    const auth = this.getLocalStorage();
    if (!auth || !auth.token) {
      return of(undefined);
    }
    obs = of(auth);
    this.isLoadingSubject.next(true);
    return obs.pipe(
      map((authModel: any) => {
        if (authModel) {
          this.currentUserSubject = new BehaviorSubject<any>(authModel.user);
        } else {
          this.logout();
        }
        return authModel;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  logout() {
    this._storageService.removeStorage('access_token');
    this.currentUserSubject.next(undefined);
    return this._router.navigate(['/login']).then();
  }
}
