import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CoreComponent } from './core.component';
import { PaginationConfig } from './paginator/paginator.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `<ng-container></ng-container>`,
})
export abstract class PagedListComponent extends CoreComponent {
  paginationConfig: PaginationConfig = {
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalItems: 0,
  };

  abstract loadData(): any;

  onPageChange(page: number): void {
    this.paginationConfig.currentPage = page;
    this.loadData();
  }

  onPageSizeChange(size: number): void {
    this.paginationConfig.pageSize = size;
    this.loadData();
  }
}
