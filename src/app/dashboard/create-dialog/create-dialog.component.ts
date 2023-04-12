import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Employee} from "../../models/employee.model";
import {DashboardService} from "../../services/dashboard.service";
import { FormControl, Validators, FormBuilder  } from '@angular/forms';
import {NotificationService} from "../../services/notification.service";

@Component({
  selector: 'app-create-dialog',
  templateUrl: './create-dialog.component.html',
  styleUrls: ['./create-dialog.component.css']
})
export class CreateDialogComponent {
  employee?: Employee;
  form: any;

  constructor(public dialogRef: MatDialogRef<CreateDialogComponent>
    , @Inject(MAT_DIALOG_DATA) public data: any
    , public dashboardService: DashboardService
    , public formBuilder: FormBuilder
    , private notificationService: NotificationService) {
    this.employee = {}

    this.form = this.formBuilder.group({
      employeeId: new FormControl(null, Validators.required),
      login: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      salary: new FormControl(null, Validators.required)
    });
  }

  save() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.employee!.employeeId = this.form.get("employeeId")?.value;
    this.employee!.login = this.form.get("login")?.value;
    this.employee!.name = this.form.get("name")?.value;
    this.employee!.salary = this.form.get("salary")?.value;

    this.dashboardService.create(this.employee)
      .subscribe(data => {
        console.log(data)
        this.dialogRef.close(this.form.value);
        this.notificationService.notify("Employee Create Success");
      }, error => {
        console.log(error);
        this.notificationService.notify(error.error);
      })
  }
}
