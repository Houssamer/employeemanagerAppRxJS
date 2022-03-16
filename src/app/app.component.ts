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
  public editEmployee: Employee | null = null;
  public deletedEmployee: Employee | null = null;

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

  addEmployee(employee: Employee) {
    document.getElementById('add-employee-form')?.click();
    this.employees$ = this.employeeService
      .addEmployee$(employee)
      .pipe(
        map((response) => {
          this.employeesSubject.next({
            appData: [...this.employeesSubject.value.appData, response],
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

  updateEmployee(employee: Employee) {
    document.getElementById('edit-close')?.click();
    this.employees$ = this.employeeService.updateEmployee$(employee).pipe(
      map((response) => {
        this.employeesSubject.next({
          appData: this.employeesSubject.value.appData.map((employee) => {
            if (employee.id === response.id) {
              employee === response;
              return employee;
            } else {
              return employee;
            }
          }),
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
  deleteEmployee(deletedE: Employee | null) {
    document.getElementById('deleteClose')?.click();
    this.employees$ = this.employeeService.deleteEmployee$(deletedE?.id).pipe(
      map((response) => {
        this.employeesSubject.next({
          appData: this.employeesSubject.value.appData.filter((employee) => {
            return employee.id !== deletedE?.id;
          }),
        });
        return {
          appData: this.employeesSubject.value.appData,
        };
      })
    );
  }

  openModal(employee: Employee | null, operation: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');

    switch (operation) {
      case 'add':
        button.setAttribute('data-target', '#addEmployeeModal');
        break;
      case 'edit':
        button.setAttribute('data-target', '#updateEmployeeModal');
        this.editEmployee = employee;
        break;
      case 'delete':
        button.setAttribute('data-target', '#deleteEmployeeModal');
        this.deletedEmployee = employee;
        break;
      default:
        break;
    }

    container?.appendChild(button);
    button.click();
  }

  searchEmployee(name: string) {}
}
