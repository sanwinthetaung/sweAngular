import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) { }

  notify(message: string) {
    this.snackBar.open(message, 'Dismiss', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 5 * 1000
    });
  }
}
