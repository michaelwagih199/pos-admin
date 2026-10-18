import { Component, OnInit, HostListener, inject, viewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { Arabic } from 'src/app/text';
import { AboutAppDialogComponent } from '../dialog/about-app-dialog/about-app-dialog.component';
import { MaintanenceService } from '../../../../maintainence/services/maintanence.service';
import { NotificationsComponent } from '../dialog/notifications/notifications.component';
import { NotificationService } from '../dialog/notifications/services/notification.service';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { MatNavList, MatListItem, MatListItemIcon, MatListItemTitle } from '@angular/material/list';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.scss'],
    imports: [MatToolbar, MatIcon, NgClass, MatSidenavContainer, MatSidenav, MatNavList, MatListItem, MatListItemIcon, MatListItemTitle, RouterLink, RouterLinkActive, MatSidenavContent, RouterOutlet]
})
export class NavBarComponent implements OnInit {
  dialog = inject(MatDialog);
  private router = inject(Router);
  private takenServive = inject(TokenStorageService);
  private maintanenceService = inject(MaintanenceService);
  private notificationService = inject(NotificationService);

  arabic: Arabic = new Arabic();
  isNotification: boolean = false;
  userName: any;
  DynamicNavBar = {
    saleOrder: true,
    stock: true,
    customers: true,
    suppliers: true,
    purshasing: false,
    retrival: true,
    expenses: false,
    reports: false,
    maintenance: false,
    setting: false,
  };

  opened = true;
  readonly sidenav = viewChild.required<MatSidenav>('sidenav');

  ngOnInit() {
    let userPermission = sessionStorage.getItem('auth-permission');
    this.userName = sessionStorage.getItem('userName')?.toString();
    if (userPermission?.includes('FULL_PERMISSION')) {
      this.DynamicNavBar.expenses = true;
      this.DynamicNavBar.stock = true;
      this.DynamicNavBar.suppliers = true;
      this.DynamicNavBar.purshasing = true;
      this.DynamicNavBar.expenses = true;
      this.DynamicNavBar.reports = true;
      this.DynamicNavBar.setting = true;
      this.DynamicNavBar.maintenance = true;
    } else {
      console.log(false);
    }

    console.log(window.innerWidth);
    if (window.innerWidth < 768) {
      this.sidenav().fixedTopGap = 48;
      this.opened = false;
    } else {
      this.sidenav().fixedTopGap = 48;
      this.opened = true;
    }

    this.getNotification();
  }



  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent) {
    const innerWidth = (event.target as Window).innerWidth;
    if (innerWidth < 768) {
      this.sidenav().fixedTopGap = 48;
      this.opened = false;
    } else {
      this.sidenav().fixedTopGap = 48;
      this.opened = true;
    }
  }


  onItemClick() {

  }


  logoutComfirm() {
    this.logout();
  }

  toHome() {
    this.redirectTo('home')
  }

  getNotification() {
    // this.maintanenceService.isHaveMaintenance().subscribe(data => {
    //   this.isNotification = data.data;
    // });
    this.notificationService.getExpiredProduct().subscribe(response => {

      if (response.data.length > 0)
        this.isNotification = true;
      else
        this.isNotification = false;
    })
  }

  toNotification() {
    const dialogRef = this.dialog.open(NotificationsComponent);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  isBiggerScreen() {
    const width =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    if (width < 768) {
      return true;
    } else {
      return false;
    }
  }

  aboutApp() {
    const dialogRef = this.dialog.open(AboutAppDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  logout() {
    this.takenServive.signOut();
    this.redirectTo('/');
  }

  redirectTo(uri: string) {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }
}
