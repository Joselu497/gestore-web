import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { navMenuConfig } from './nav-menu.config';
import { provideIcons, NgIcon } from '@ng-icons/core';
import { heroArrowLeftEndOnRectangle, heroBanknotes, heroShoppingBag, heroShoppingCart } from '@ng-icons/heroicons/outline';
import { AuthService } from '../../../_core/services/auth.service';

export interface NavMenuItem {
  name: string;
  icon: string;
  href: string;
}

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  templateUrl: './nav-menu.component.html',
  imports: [CommonModule, NgIcon],
  providers: [provideIcons({ heroShoppingBag, heroArrowLeftEndOnRectangle, heroBanknotes, heroShoppingCart })],
})
export class NavMenuComponent {
  navMenuConfig: { items: NavMenuItem[] } = navMenuConfig;

  private _authService = inject(AuthService);

  currentUser = this._authService.currentUserValue;

  logout() {
    this._authService.logout();
  }
}
