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

  all(search = {}, relations: string[] = [], page = 0, limit = 20, order?: string): Observable<any> {
    return this.http.get<any>(this.getUrl(), {
      params: this.getParams(search, relations, page, limit, order),
    });
  }

  get(id: number | string, search?: any, relations?: string[]): Observable<any> {
    return this.http.get<T>(this.getUrl() + '/' + id, {
      params: this.getParams(search, relations),
    });
  }

  save(id: number | string | null, item: any, args: any = null): Observable<any> {
    let params;
    if (!!args) {
      params = { params: this.getParams(args) };
    }

    if (!id) {
      return this.http.post<T>(this.getUrl(), item, params);
    } else {
      return this.http.patch<T>(this.getUrl() + '/' + id, item, params);
    }
  }

  delete(id: number | string) {
    return this.http.delete<T>(this.getUrl() + '/' + id);
  }

  protected getParams(
    search: any,
    relations?: string[],
    page?: number,
    limit?: number,
    order?: string,
  ): HttpParams {
    let params = new HttpParams();
    if (!!search) {
      Object.keys(search).forEach((key) => {
        if (search[key] !== null && search[key] !== undefined) {
          params = params.append(key, search[key]);
        }
      });
    }
    if (relations && relations.length > 0) {
      relations.forEach((relation) => {
        params = params.append('relations', relation);
      });
    }
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
