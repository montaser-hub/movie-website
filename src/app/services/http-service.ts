import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { catchError,  throwError } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http:HttpClient) { }
apiKey = environment.tmdb.apiKey;
  private apiUrl = environment.tmdb.apiUrl;
request_token:string=''


login(username: string, password: string): Observable<any> {
  return this.http
    // Step 1: Get request token
    .get<any>(`${this.apiUrl}/authentication/token/new?api_key=${this.apiKey}`)
    .pipe(
      switchMap((res: any) => {
        const request_token = res.request_token;

        // Step 2: Validate token with login
        return this.http.post<any>(
          `${this.apiUrl}/authentication/token/validate_with_login?api_key=${this.apiKey}`,
          { username, password, request_token }
        ).pipe(
          // Step 3: Create session after validation
          switchMap(() => {
            return this.http.post<any>(
              `${this.apiUrl}/authentication/session/new?api_key=${this.apiKey}`,
              { request_token }
            );
          })
        );
      }),
      // Global error handler for ANY of the above requests
      catchError((err) => {
        let message = 'An unknown error occurred';

        if (err.error?.status_message) {
          message = err.error.status_message; // TMDB returns nice error messages
        } else if (err.message) {
          message = err.message;
        }
        // Pass the error down as an observable
        return throwError(() => new Error(message));
      })
    );
}

get(endpoint: string, params?: Record<string, any>): Observable<any> {
  let url = `${this.apiUrl}/${endpoint}?api_key=${this.apiKey}`;

  if (params) {
    const query = new URLSearchParams(params).toString();
    url += `&${query}`;
  }

  return this.http.get(url);
 }

 post(body: any, endpoint: string): Observable<any> {
  // لو الـ endpoint فيه أصلاً '?'
  const separator = endpoint.includes('?') ? '&' : '?';

  return this.http.post(
    `${this.apiUrl}/${endpoint}${separator}api_key=${this.apiKey}`,
    body
  );
}
}
