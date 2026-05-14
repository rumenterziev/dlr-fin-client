import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { POLICY_LAST_UPDATED, POLICY_VERSION } from '../../core/config/privacy';

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
}
