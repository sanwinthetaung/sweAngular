import {Component, OnInit, ViewChild} from '@angular/core';
import {Employee} from "../models/employee.model";
import {DashboardService} from "../services/dashboard.service";
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {FormControl, FormGroup} from '@angular/forms';
import {DashboardSearchPayload} from "./dashboard-search-payload";
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from "./confirm-dialog/confirm-dialog.component";
import {EditDialogComponent} from "./edit-dialog/edit-dialog.component";
import {CreateDialogComponent} from "./create-dialog/create-dialog.component";
import {HttpEventType, HttpResponse} from '@angular/common/http';
import {NotificationService} from "../services/notification.service";

const default_limit: string = "5";
const default_sort: string = "+name";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit  {

  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  employees: Employee[] = [];
  employee: Employee = {};
  totalElements: number = 0;

  form: FormGroup = new FormGroup({});
  payload: DashboardSearchPayload;

  offset?: string = "0";
  limit: string = default_limit;
  sort?: string = default_sort;

  selectedFiles: FileList | undefined;
  currentFile: any;
  message = '';

  constructor(public dashboardService: DashboardService
              , public dialog: MatDialog
              , private notificationService: NotificationService) {
    this.payload =  {
      minSalary: 0.0,
      maxSalary: 0.0
    }

    this.form = new FormGroup({
      minSalary: new FormControl(''),
      maxSalary: new FormControl('')
    });

  }

  ngOnInit(): void {
    this.getEmployeeList({ offset: "0", limit: default_limit, sort: default_sort});
  }

  getEmployeeList(request: any) {

    this.payload.minSalary = this.form?.get("minSalary")?.value;
    this.payload.maxSalary = this.form?.get("maxSalary")?.value;

    // @ts-ignore
    request['minSalary'] = this.payload.minSalary;
    // @ts-ignore
    request['maxSalary'] = this.payload.maxSalary;

    this.dashboardService.getAll(request)
      .subscribe(data => {
          if (data) {
            this.employees = data['data'];
            this.totalElements = data['totalItems'];
          } else {
            this.employees = [];
            this.totalElements = 0;
          }
        }
        , error => {
          console.log(error.error.message);
        }
      );
  }

  removeEmployee(id: string) {
    this.dashboardService.delete(id)
      .subscribe(data => {
        this.getEmployeeList({ offset: "0", limit: default_limit, sort: default_sort});
      }, error => {
        console.log(error.error.message);
      })
  }

  nextPage($event: PageEvent) {
    const request = {};
    this.offset = $event.pageIndex.toString();
    this.limit = $event.pageSize.toString();

    // @ts-ignore
    request['offset'] = this.offset;
    // @ts-ignore
    request['limit'] = this.limit;
    // @ts-ignore
    request['sort'] = default_sort;
    // @ts-ignore
    this.getEmployeeList(request);
  }

  search() {
    this.offset = '0';
    this.limit = default_limit;

    const request = {};
    // @ts-ignore
    request['offset'] = this.offset;
    // @ts-ignore
    request['limit'] = this.limit;
    // @ts-ignore
    request['sort'] = this.sort;
    this.getEmployeeList(request);

    this.paginator!.pageIndex = 0;
  }

  searchEmployee() {
    const request = {};
    // @ts-ignore
    request['offset'] = this.offset;
    // @ts-ignore
    request['limit'] = this.limit;
    // @ts-ignore
    request['sort'] = this.sort;
    // @ts-ignore
    this.getEmployeeList(request);
  }

  sortData($event: any) {
    if (!$event.active || $event.direction === '') {
      this.getEmployeeList({ offset: "0", limit: this.offset, sort: default_sort});
      return;
    }

    const isAsc = $event.direction === 'asc';
    switch ($event.active) {
      case 'login': {
        this.sort = (isAsc ? "+login" : "-login");
        return this.getEmployeeList({ offset: this.offset, limit: this.limit, sort: this.sort});
      }
      case 'name': {
        this.sort = (isAsc ? "+login" : "-login");
        return this.getEmployeeList({ offset: this.offset, limit: this.limit, sort: this.sort});
      }
      case 'salary': {
        this.sort = (isAsc ? "+login" : "-login");
        return this.getEmployeeList({ offset: this.offset, limit: this.limit, sort: this.sort});
      }
    }
  }

  edit(enterAnimationDuration: string, exitAnimationDuration: string, employeeId: string): void {
    this.dashboardService.get(employeeId)
      .subscribe(data => {
        if (data) {
          this.employee.employeeId = data.employeeId;
          this.employee.login = data.login;
          this.employee.name = data.name;
          this.employee.salary = data.salary;

          this.dialog.open(EditDialogComponent, {
            data: {
              employee: this.employee
            },
            width: '500px',
            enterAnimationDuration,
            exitAnimationDuration,
            disableClose: true
          }).afterClosed()
            .subscribe(() => {
              this.searchEmployee();
            });
        }
    }, error => {
      console.log(error.error.message);
    })
  }

  delete(enterAnimationDuration: string, exitAnimationDuration: string, employeeId: string): void {
    console.log("openconfirmDialog" + employeeId);
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        employeeId: employeeId
      },
      width: '400px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true
    }).afterClosed()
      .subscribe(() => {
        this.searchEmployee();
      });
  }

  create(enterAnimationDuration: string, exitAnimationDuration: string) {
    this.dialog.open(CreateDialogComponent, {
      width: '400px',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true
    }).afterClosed()
      .subscribe(() => {
        this.searchEmployee();
      });
  }

  selectFile(event: any) {
    this.selectedFiles = event.target.files;
  }

  upload() {
    // @ts-ignore
    this.currentFile = this.selectedFiles.item(0);
    this.dashboardService.upload(this.currentFile).subscribe(
        (event: { type: HttpEventType; loaded: number; total: number; body: { message: string; }; }) => {
        if (event instanceof HttpResponse) {
          this.message = event.body.message;
          this.notificationService.notify(this.message);
          this.selectedFiles = undefined;
          this.searchEmployee();
        }
      },
      () => {
        this.message = 'Could not upload the file!';
        this.currentFile = undefined;
        this.notificationService.notify(this.message);
      });

    this.selectedFiles = undefined;
  }
}


