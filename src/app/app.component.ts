import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { NgxSonnerToaster } from 'ngx-sonner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxSonnerToaster],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  // 2. Inyéctalo en el constructor
  constructor(private authService: AuthService) { }

  // 3. Llama al checkAuthStatus() aquí
  ngOnInit(): void {
    this.authService.checkAuthStatus().subscribe();
  }
}