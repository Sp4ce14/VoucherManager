import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/vouchers/services/auth-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }
  public logout(): void {
    if (confirm("Are you sure you want to logout?")) {
      this.authService.logOut();
    }
  }
}
