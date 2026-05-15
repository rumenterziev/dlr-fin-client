import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { POLICY_LAST_UPDATED, POLICY_VERSION } from '../../core/config/privacy';
import { SeoService } from '../../core/service/seo';

@Component({
  selector: 'app-terms',
  imports: [RouterLink],
  templateUrl: './terms.html',
  styleUrl: './terms.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Terms {
  readonly policyVersion = POLICY_VERSION;
  readonly policyLastUpdated = POLICY_LAST_UPDATED;

  constructor() {
    inject(SeoService).update({
      title: 'Terms of Service',
      description: 'Terms of service for rumen.dev.',
      path: '/terms',
    });
  }
}
