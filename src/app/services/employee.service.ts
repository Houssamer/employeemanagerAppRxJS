import { Employee } from './../Employee';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl: string = 'http://localhost:8080/employee';

  constructor(private http: HttpClient) {}

  getAllEmployee$ = <Observable<Employee[]>>(
    this.http
      .get<Employee[]>(`${this.apiUrl}/all`)
      .pipe(tap(console.log), catchError(this.handleError))
  );

  getEmployeeById$ = (id: number) =>
    <Observable<Employee>>(
      this.http
        .get<Employee>(`${this.apiUrl}/find/${id}`)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  addEmployee$ = (employee: Employee) =>
    <Observable<Employee>>(
      this.http
        .post<Employee>(`${this.apiUrl}/add`, employee)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  updateEmployee$ = (employee: Employee) =>
    <Observable<Employee>>(
      this.http
        .post<Employee>(`${this.apiUrl}/update`, employee)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  deleteEmployee$ = (id: number | undefined) =>
    <Observable<any>>(
      this.http
        .delete(`${this.apiUrl}/delete/${id}`)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(() => new Error('An error has been occured'));
  }
}
