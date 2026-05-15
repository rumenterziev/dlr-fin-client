import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { ConverterService } from '../../../core/service/converter';
import { AuthService } from '../../../core/service/auth';
import { SeoService } from '../../../core/service/seo';
import { Converted } from '../../../core/model/converted.model';
import { Conversions } from './conversions/conversions';

interface CurrencyOption {
  code: string;
  name: string;
  flag: string;
}

@Component({
  selector: 'app-converter',
  imports: [ReactiveFormsModule, RouterLink, Conversions],
  templateUrl: './converter.html',
  styleUrl: './converter.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Converter {
  private readonly fb = inject(FormBuilder);
  private readonly converterService = inject(ConverterService);
  private readonly authService = inject(AuthService);
  private readonly snack = inject(MatSnackBar);

  readonly isAuthenticated = computed(() => !!this.authService.user());

  constructor() {
    inject(SeoService).update({
      title: 'Currency Converter',
      description:
        'Convert between BGN, EUR, USD and CAD with live rates, instant feedback and conversion history. Built with Angular and Spring Boot.',
      path: '/applications/converter',
    });
  }

  readonly currencies: CurrencyOption[] = [
    { code: 'BGN', name: 'Bulgarian Lev', flag: 'flags/bg.svg' },
    { code: 'EUR', name: 'Euro', flag: 'flags/eu.svg' },
    { code: 'USD', name: 'US Dollar', flag: 'flags/us.svg' },
    { code: 'CAD', name: 'Canadian Dollar', flag: 'flags/ca.svg' },
  ];

  readonly form: FormGroup = this.fb.group({
    fromCurrency: ['BGN', Validators.required],
    toCurrency: ['EUR', Validators.required],
    amount: [1, [Validators.required, Validators.min(0.0001)]],
  });

  readonly isConverting = signal(false);
  readonly resultSum = signal<number | null>(null);
  readonly hasResult = signal(false);
  readonly lastConverted = signal<{ amount: number; from: string; to: string } | null>(null);

  private readonly formValue = toSignal(this.form.valueChanges, {
    initialValue: this.form.value,
  });
  private readonly formStatus = toSignal(this.form.statusChanges, {
    initialValue: this.form.status,
  });

  readonly fromCurrency = computed(() => this.formValue().fromCurrency as string);
  readonly toCurrency = computed(() => this.formValue().toCurrency as string);
  readonly amount = computed(() => this.formValue().amount as number);
  readonly fromFlag = computed(() => this.flagFor(this.fromCurrency()));
  readonly toFlag = computed(() => this.flagFor(this.toCurrency()));

  readonly canConvert = computed(
    () =>
      this.formStatus() === 'VALID' &&
      !this.isConverting() &&
      this.fromCurrency() !== this.toCurrency(),
  );

  swap(): void {
    const { fromCurrency, toCurrency } = this.form.value;
    this.form.patchValue({ fromCurrency: toCurrency, toCurrency: fromCurrency });
    if (this.hasResult()) {
      this.onConvertRequest();
    }
  }

  private flagFor(code: string): string {
    return this.currencies.find((c) => c.code === code)?.flag || '';
  }

  onConvertRequest(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { fromCurrency, toCurrency, amount } = this.form.value;

    this.isConverting.set(true);
    this.converterService.convertCurrency(fromCurrency, toCurrency, amount).subscribe({
      next: (resp: Converted) => {
        this.resultSum.set(parseFloat(resp.resultSum.toFixed(4)));
        this.lastConverted.set({ amount, from: fromCurrency, to: toCurrency });
        this.hasResult.set(true);
        this.isConverting.set(false);
        if (this.isAuthenticated()) {
          this.converterService.fetchConversionsHistory(0).subscribe();
        }
      },
      error: (e: unknown) => {
        console.error(e);
        this.isConverting.set(false);
        this.snack.open('Conversion failed. Please review your input and try again.', 'Dismiss', {
          duration: 5000,
          panelClass: ['snack-error'],
        });
      },
    });
  }
}
