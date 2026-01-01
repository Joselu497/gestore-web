import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

export interface PaginationConfig {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  imports: [CommonModule, NgSelectModule, FormsModule],
})
export class PaginatorComponent {
  @Input() config: PaginationConfig = {
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalItems: 0,
  };

  @Output() pageChange = new EventEmitter<number>();
  @Output() sizeChange = new EventEmitter<number>();

  pageSizeOptions = [10, 20, 50, 100];

  get pages(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(
      1,
      this.config.currentPage - Math.floor(maxVisiblePages / 2)
    );
    let endPage = Math.min(
      this.config.totalPages,
      startPage + maxVisiblePages - 1
    );

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  goToPage(page: number): void {
    if (
      page >= 1 &&
      page <= this.config.totalPages &&
      page !== this.config.currentPage
    ) {
      this.pageChange.emit(page);
    }
  }

  previousPage(): void {
    if (this.config.currentPage > 1) {
      this.pageChange.emit(this.config.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.config.currentPage < this.config.totalPages) {
      this.pageChange.emit(this.config.currentPage + 1);
    }
  }

  onPageSizeChange(): void {
    this.sizeChange.emit(this.config.pageSize);
  }
}
