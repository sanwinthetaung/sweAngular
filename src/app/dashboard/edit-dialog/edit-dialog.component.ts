import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Employee} from "../../models/employee.model";
import {DashboardService} from "../../services/dashboard.service";
import { FormControl, FormGroup, Validators,NgForm, FormBuilder  } from '@angular/forms';
import {NotificationService} from "../../services/notification.service";


@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css']
})
export class EditDialogComponent implements OnInit {
  employee?: Employee;
  employeeId?: string;
  form: any;

  constructor(public dialogRef: MatDialogRef<EditDialogComponent>
        , @Inject(MAT_DIALOG_DATA) public data: any
        , public formBuilder: FormBuilder
        , public dashboardService: DashboardService
        , private notificationService: NotificationService) {
    this.form = this.formBuilder.group({
      login: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      salary: new FormControl(null, Validators.required)
    });
    this.employee = {}

  }

  ngOnInit(): void {
    this.form.controls['login'].setValue(this.data.employee.login);
    this.form.controls['name'].setValue(this.data.employee.name);
    this.form.controls['salary'].setValue(this.data.employee.salary);
  }

  save() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.employee!.employeeId = this.data.employee.employeeId;
    this.employee!.login = this.form.get("login")?.value;
    this.employee!.name = this.form.get("name")?.value;
    this.employee!.salary = this.form.get("salary")?.value;

    this.dashboardService.update(this.data.employee.employeeId, this.employee)
      .subscribe(data => {
        console.log(data);
        this.notificationService.notify("Update Success");
        this.dialogRef.close(this.form.value);
      }, error => {
        this.notificationService.notify("Update Fail");
        console.log(error.error);
      });
  }
}


