import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { AddUserDialogComponent } from 'src/app/setting/dialogs/add-user-dialog/add-user-dialog.component';
import { UserModel } from 'src/app/setting/models/user';
import { UserService } from 'src/app/setting/services/user.service';
import { ConfirmationDialog } from 'src/app/shared/components/layout/dialog/confirmation/confirmation.component';
import { Arabic } from 'src/app/text';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  arabic: Arabic = new Arabic()
  isLoading: boolean = false

  displayedColumns: string[] = ['id', 'userName', 'userEmail', 'userRole', 'actions'];
  userList!: UserModel[];

  constructor(private userService: UserService,
    private authService: AuthService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private router: Router) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  /**data */
  getAllUsers() {
    this.userService.getAllUsers().subscribe(data => {
      this.userList = data;
    })
  }

  /**actions */
  addNewUser() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // dialogConfig.data = {
    //   model: this.user,
    // }

    this.isLoading = true

    const dialogRef = this.dialog.open(AddUserDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
        this.isLoading = false
        console.log(data)
        if (data) {
          this.authService.register(data.userModel, data.selectedRoles).subscribe(data => {
            this.openSnackBar(`${this.arabic.util.saved}`, '')
            this.getAllUsers()
          }, error => console.log(data))
        }
      }
    );
  }

  deleteDialog(user: UserModel) {
    
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        message: `${this.arabic.stock.category.util.dialog.deleteDialog.title}: ${user.username}`,
        buttonText: {
          ok: `${this.arabic.stock.category.util.dialog.dialogButtons.ok}`,
          cancel: `${this.arabic.stock.category.util.dialog.dialogButtons.cancel}`
        }
      }
    });
    
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.userService.deleteUser(user.id).subscribe(data => {
          console.log(data);
          this.openSnackBar(`${this.arabic.stock.category.util.dialog.notification.deleted}`, '')
          this.getAllUsers()
        }, error => console.log(error))
        const a = document.createElement('a');
        a.click();
        a.remove();
      }
    });

  }


  /**
   * ui ux 
   */
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }


}


