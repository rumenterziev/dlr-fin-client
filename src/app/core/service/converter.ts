import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { map } from 'rxjs';
import { PageResult } from '../model/page-result.model';
import { Convert } from '../model/convert.model';
import { Converted } from '../model/converted.model';

@Injectable({
  providedIn: 'root',
})
export class ConverterService {
  readonly pageResult = signal<PageResult | null>(null);

  constructor(private http: HttpClient) {}

  fetchConversionsHistory(page: number) {
    const conversionsUrl = `/api/v1/converter/conversions/mine?page=${page}`;
    return this.http.get<PageResult>(conversionsUrl, { withCredentials: true }).pipe(
      map((response) => {
        const pageResult = response;
        this.pageResult.set(pageResult);
        return pageResult;
      }),
    );
  }

  convertCurrency(fromCurrency: string, toCurrency: string, amount: number) {
    const url = '/api/v1/converter/bnb-rates';

    const convertRequest: Convert = {
      fromCurrency: fromCurrency,
      toCurrency: toCurrency,
      amount: amount,
    };

    return this.http.post<Converted>(url, convertRequest).pipe(
      map((response) => {
        const converted: Converted = {
          fromCurrency: response.fromCurrency,
          toCurrency: response.toCurrency,
          amount: response.amount,
          resultSum: response.resultSum,
          currencyRate: response.currencyRate,
          createdAt: response.createdAt,
        };
        return converted;
      }),
    );
  }
}
