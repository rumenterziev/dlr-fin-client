import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { ConverterService } from '../../../../core/service/converter';
import { AuthService } from '../../../../core/service/auth';
import { PageResult } from '../../../../core/model/page-result.model';

const PAGE_SIZE = 5;

@Component({
  selector: 'app-conversions',
  imports: [],
  templateUrl: './conversions.html',
  styleUrl: './conversions.scss',
})
export class Conversions implements OnInit {
  private readonly converterService = inject(ConverterService);
  private readonly authService = inject(AuthService);

  readonly page = signal(1);
  readonly totalRecords = signal(0);
  readonly conversions = signal<PageResult['items']>([]);

  readonly disablePreviousPage = computed(() => this.page() <= 1);
  readonly disableNextPage = computed(() => this.totalRecords() <= this.page() * PAGE_SIZE);

  constructor() {
    effect(() => {
      const result = this.converterService.pageResult();
      if (result) {
        this.totalRecords.set(result.totalRecords);
        this.conversions.set(result.items);
      }
    });
  }

  ngOnInit(): void {
    if (this.authService.user()) {
      this.fetchConversions(this.page());
    }
  }

  fetchConversions(page: number): void {
    this.converterService.fetchConversionsHistory(page - 1).subscribe();
  }

  nextPage(): void {
    if (this.totalRecords() > this.page() * PAGE_SIZE) {
      this.page.update((p) => p + 1);
      this.fetchConversions(this.page());
    }
  }

  previousPage(): void {
    if (this.page() > 1) {
      this.page.update((p) => p - 1);
      this.fetchConversions(this.page());
    }
  }
}
