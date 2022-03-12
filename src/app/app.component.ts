import { CustomResponse } from './CustomResponse';
import { EmployeeService } from './services/employee.service';
import { Employee } from './Employee';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, map, Observable, of, catchError } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  employees$!: Observable<CustomResponse>;
  private employeesSubject = new BehaviorSubject<CustomResponse>({
    appData: [],
  });

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.employees$ = this.employeeService.getAllEmployee$.pipe(
      map((response) => {
        console.log(response);
        this.employeesSubject.next({ appData: response });
        return {
          appData: response,
        };
      }),
      catchError((error: string) => {
        console.error(error);
        return of({
          appData: [],
          error: error,
        });
      })
    );
  }

  addEmployee(employee: NgForm) {
    this.employees$ = this.employeeService
      .addEmployee$(employee.value as Employee)
      .pipe(
        map((response) => {
          this.employeesSubject.next({
            appData: [response, ...this.employeesSubject.value.appData],
          });
          return {
            appData: [response, ...this.employeesSubject.value.appData],
          };
        }),
        catchError((error: string) => {
          console.log(error);
          return of({
            appData: this.employeesSubject.value.appData,
            error: error,
          });
        })
      );
  }

  updateEmployee(employee: Employee) {
    this.employees$ = this.employeeService
      .updateEmployee$(employee)
      .pipe(
        map((response) => {
          this.employeesSubject.value.appData =
            this.employeesSubject.value.appData.map((employee) => {
              if (employee.id === response.id) {
                employee === response;
                return employee;
              } else {
                return employee;
              }
            });
          this.employeesSubject.next({
            appData: this.employeesSubject.value.appData,
          });
          return {
            appData: this.employeesSubject.value.appData,
          };
        }),
        catchError((error: string) => {
          console.log(error);
          return of({
            appData: this.employeesSubject.value.appData,
            error: error,
          });
        })
      );
  }
}
