import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public isLoggedIn: boolean;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
   this.authService.isLoggedin$.subscribe(loggedIn => this.isLoggedIn = loggedIn);
  }
  public logout(): void {
    if (confirm("Are you sure you want to logout?")) {
      this.authService.logOut();
    }
  }
}
