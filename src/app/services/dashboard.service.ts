import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpRequest} from "@angular/common/http";

const baseUrl = 'http://localhost:8080/api/';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getAll(request: any): Observable<any> {
    const params = request;
    return this.http.get(baseUrl + "/users?", {params: params});
  }

  get(id: any): Observable<any> {
    return this.http.get(`${baseUrl}/users/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/user`, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.patch(`${baseUrl}/users/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/users/${id}`);
  }

  upload(file: File): any {
    const formData: FormData = new FormData();
    formData.append('file', file);

    const req = new HttpRequest('POST', `${baseUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }
}
