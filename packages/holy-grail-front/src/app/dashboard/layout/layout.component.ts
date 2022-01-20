import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import IUser from 'src/app/auth/user';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor(private authService: AuthService) { }

  user?: IUser | null;

  async ngOnInit() {
    this.user = this.authService.getUser();
  }

  logout() {
    this.authService.logout();
  }

}
