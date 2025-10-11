import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Model } from '../interfaces/model';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseService<T extends Model> {
  protected http: HttpClient = inject(HttpClient);

  abstract url: string;
  filter = '';

  constructor() {}

  getUrl() {
    return environment.apiUrl + this.url;
  }

  all(page = 0, limit = 20, order?: string): Observable<any> {
    return this.http.get<any>(this.getUrl(), {
      params: this.getParams(page, limit, order),
    });
  }

  protected getParams(
    page?: number,
    limit?: number,
    order?: string
  ): HttpParams {
    let params = new HttpParams();
    if (!!page) {
      params = params.append('page', page.toString());
    }
    if (!!limit) {
      params = params.append('limit', limit.toString());
    }
    if (!!order) {
      params = params.append('order', order);
    }

    return params;
  }
}
