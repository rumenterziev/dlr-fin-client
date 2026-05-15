import { Component, inject } from '@angular/core';
import { SeoService } from '../../core/service/seo';

@Component({
  selector: 'app-not-found',
  imports: [],
  templateUrl: './not-found.html',
  styleUrl: '../server-error/server-error.scss',
})
export class NotFound {
  constructor() {
    inject(SeoService).update({
      title: 'Page not found',
      description: 'The page you are looking for could not be found.',
      noIndex: true,
    });
  }
}
