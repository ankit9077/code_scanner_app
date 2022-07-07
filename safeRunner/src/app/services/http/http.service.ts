/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  AUTHORIZATION_KEY = 'auth-token';
  constructor(private httpClient: HttpClient) { }

  get(url: string) {
    return this.httpClient.get(environment.api + url, { headers: this.GetHttpHeaders() });
  }

  post(url: string, body: any, header = {}) {
    return this.httpClient.post(environment.api + url, body, { headers: this.GetHttpHeaders(header) });
  }

  put(url: string, body: any, header = {}) {
    return this.httpClient.put(environment.api + url, body, { headers: this.GetHttpHeaders(header) });
  }


  delete(url: string, header = {}) {
    return this.httpClient.delete(environment.api + url, { headers: this.GetHttpHeaders(header) });
  }

  private GetHttpHeaders(header: any = {}): HttpHeaders {
    if (!header['Content-Type']) {
      header['Content-Type'] = 'application/json';
    }
    header['Access-Control-Allow-Origin'] = '*';
    if (localStorage.getItem(this.AUTHORIZATION_KEY)) {
      header['auth-token'] = localStorage.getItem(this.AUTHORIZATION_KEY);
    }
    if (!header['Content-Type'].trim().length) {
      delete header['Content-Type'];
    }
    const headers = new HttpHeaders({ ...header });

    return headers;
  }
}
