import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  getStorage(item: string): string | null {
    return localStorage.getItem(item);
  }

  setStorage(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  removeStorage(key: string): void {
    localStorage.removeItem(key);
  }
}
