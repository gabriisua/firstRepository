import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loader-overlay" *ngIf="isLoading">
      <div class="spinner"></div>
    </div>
  `
})
export class LoaderComponent {
  @Input() isLoading: boolean = false; // sempre boolean
}
