import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { POLICY_LAST_UPDATED, POLICY_VERSION } from '../../core/config/privacy';
import { SeoService } from '../../core/service/seo';

@Component({
  selector: 'app-privacy',
  imports: [RouterLink],
  templateUrl: './privacy.html',
  styleUrl: './privacy.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Privacy {
  readonly policyVersion = POLICY_VERSION;
  readonly policyLastUpdated = POLICY_LAST_UPDATED;

  constructor() {
    inject(SeoService).update({
      title: 'Privacy Policy',
      description: 'Privacy policy for rumen.dev — what data is collected and how it is used.',
      path: '/privacy',
    });
  }
}
