import { EmployeeService } from './services/employee.service';
import { Employee } from './Employee';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'employeemanagerAppRxJS';
  private employeesSubject = new BehaviorSubject<Employee[]>([]);

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {

  }

}
