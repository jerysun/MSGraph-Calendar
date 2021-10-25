import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';
import { User } from '../user';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  // should the collapsed nav show?
  showNav = false;
  get authenticated(): boolean {
    return this.authService.authenticated;
  }
  get user(): User | undefined {
    return this.authService.user;
  }

  constructor(private authService: AuthService) { }

  ngOnInit(): void { }

  toggleNavBar(): void {
    this.showNav = !this.showNav;
  }

  signIn(): void {
    this.authService.signIn();
  }

  signOut(): void {
    this.authService.signOut();
  }

}
