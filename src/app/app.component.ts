import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { NavbarComponent } from './public/navbar/navbar.component';
import { LoaderComponent } from './public/loader/loader.component';
import { LoaderService } from './core/Services/loader.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { AuthService } from './core/Services/AuthService';
import { FooterComponent } from "./public/footer/footer.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    LoaderComponent,
    FooterComponent
],
  template: `
    <app-public-navbar *ngIf="isPublic$ | async"></app-public-navbar>

    <app-loader *ngIf="isLoading$ | async as loading" [isLoading]="loading"></app-loader>


    <router-outlet></router-outlet>
    <app-footer></app-footer>
  `
})
export class AppComponent implements OnInit {
  isPublic$: Observable<boolean>;
  isLoading$: Observable<boolean>;

  constructor(
    private router: Router,
    private loaderService: LoaderService,
    private authService: AuthService
  ) {
    this.isPublic$ = this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(e => !e.urlAfterRedirects.startsWith('/admin')),
      startWith(true)
    );

    this.isLoading$ = this.loaderService.isLoading$;
  }

  ngOnInit(): void {
    this.authService.refreshToken().subscribe({
      next: () => console.log('✅ Sessione ripristinata'),
      error: () => console.log('ℹ️ Nessuna sessione da ripristinare')
    });
  }
}






