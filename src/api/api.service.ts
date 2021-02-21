import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Todo } from 'src/types/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private _httpClient: HttpClient) {}

  getTodos(start = 0, limit = 10): Observable<Todo[]> {
    let params = new HttpParams();
    params = params.set('_start', start.toString());
    params = params.set('_limit', limit.toString());
    
    return this._httpClient.get<Todo[]>(environment.TODO_BASE_URL, {
      params,
    });
  }
}
