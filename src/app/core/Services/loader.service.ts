import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private _isLoading = new BehaviorSubject<boolean>(false);
  public isLoading$ = this._isLoading.asObservable();

  show() {
  // Posticipa il next di un tick per evitare l’errore
  setTimeout(() => this._isLoading.next(true));
}

hide() {
  setTimeout(() => this._isLoading.next(false));
}

}


