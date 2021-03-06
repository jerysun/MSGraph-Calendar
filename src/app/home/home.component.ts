import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';
import { User } from '../user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  get authenticated(): boolean {
    return this.authService.authenticated;
  }
  get user(): User | undefined {
    return this.authService.user;
  }

  constructor(private authService: AuthService) { }

  ngOnInit(): void { }

  async signIn(): Promise<void> {
    await this.authService.signIn();
  }

}
