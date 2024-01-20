import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { Arabic } from 'src/app/text';
import { AboutAppDialogComponent } from '../dialog/about-app-dialog/about-app-dialog.component';
import { MaintanenceService } from '../../../../maintainence/services/maintanence.service';
import { NotificationsComponent } from '../dialog/notifications/notifications.component';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
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
  @ViewChild('sidenav', { static: true })
  sidenav!: MatSidenav;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private takenServive: TokenStorageService,
    private maintanenceService: MaintanenceService,
  ) { }

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
      this.sidenav.fixedTopGap = 55;
      this.opened = false;
    } else {
      this.sidenav.fixedTopGap = 55;
      this.opened = true;
    }

    this.getNotification()
  }



  @HostListener('window:resize', ['$event'])
  onResize(event: { target: { innerWidth: number } }) {
    if (event.target.innerWidth < 768) {
      this.sidenav.fixedTopGap = 55;
      this.opened = false;
    } else {
      this.sidenav.fixedTopGap = 55;
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
    this.maintanenceService.isHaveMaintenance().subscribe(data => {
      this.isNotification = data.data;
    });
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
