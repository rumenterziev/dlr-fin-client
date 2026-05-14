import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { POLICY_LAST_UPDATED, POLICY_VERSION } from '../../core/config/privacy';

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
}
