import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DashboardService} from "../../services/dashboard.service";
import {NotificationService} from "../../services/notification.service";

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>
              , @Inject(MAT_DIALOG_DATA) public data: any
              , public dashboardService: DashboardService
              , public notificationService: NotificationService) {}

  employeeId?: string;

  ngOnInit(): void {
    this.employeeId = this.data.employeeId;
  }

  removeEmployee(id: string) {
    this.dashboardService.delete(id)
      .subscribe(data => {
        console.log(data);
        this.notificationService.notify("Delete Employee Success.");
      }, error => {
        this.notificationService.notify("Delete Employee Error.");
      })
  }

  onCancel() {
    this.dialogRef.close();
  }

  onOk() {
    this.removeEmployee(this.data.employeeId);
    this.dialogRef.close();
  }
}
