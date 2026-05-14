import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../core/service/auth';
import { PrivacyService } from '../../core/service/privacy';
import {
  CONSENT_STORAGE_KEY,
  ConsentRecord,
  POLICY_LAST_UPDATED,
  POLICY_VERSION,
} from '../../core/config/privacy';

@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly privacyService = inject(PrivacyService);
  private readonly route = inject(ActivatedRoute);

  readonly fallbackPolicyVersion = POLICY_VERSION;
  readonly policyLastUpdated = POLICY_LAST_UPDATED;

  /** Authoritative version from the backend (falls back to local constant). */
  readonly policyVersion = signal<string>(POLICY_VERSION);

  readonly consent = signal(false);
  readonly showRedirectMessage = signal(false);
  readonly consentRequired = signal(false);
  readonly returnUrl = signal<string | null>(null);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly canContinue = computed(() => this.consent() && !this.isSubmitting());

  ngOnInit(): void {
    this.consent.set(this.readStoredConsent(this.policyVersion()));

    this.route.queryParams.subscribe((params) => {
      this.showRedirectMessage.set(params['authRequired'] === 'true');

      if (params['consentRequired'] === 'true') {
        this.consentRequired.set(true);
        // Server told us which version it expects — trust it.
        const fromServer = params['policyVersion'];
        if (typeof fromServer === 'string' && fromServer) {
          this.policyVersion.set(fromServer);
          // Stale local consent for a different version → clear the box.
          this.consent.set(this.readStoredConsent(fromServer));
        }
      }

      const url = params['returnUrl'];
      this.returnUrl.set(typeof url === 'string' && url ? url : null);
    });

    // Discover the current policy version from the server (best-effort).
    this.privacyService.loadPolicyVersion().subscribe((version) => {
      if (!version) return;
      const previous = this.policyVersion();
      this.policyVersion.set(version);
      if (version !== previous) {
        // Version changed under us — re-evaluate stored consent against it.
        this.consent.set(this.readStoredConsent(version));
      }
    });
  }

  toggleConsent(checked: boolean): void {
    this.consent.set(checked);
    this.errorMessage.set(null);
    if (checked) {
      this.persistConsent(this.policyVersion());
    }
  }

  async loginWithGoogle(): Promise<void> {
    if (!this.canContinue()) return;

    const version = this.policyVersion();
    this.persistConsent(version);
    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    try {
      // Step A: stash consent on the backend session.
      await this.privacyService.postConsent(version);
      // Step B: top-level navigation so JSESSIONID travels along.
      this.authService.loginWithGoogle();
    } catch (err) {
      console.error('Consent stash failed:', err);
      this.isSubmitting.set(false);
      this.errorMessage.set(
        'We could not record your consent. Please try again or refresh the page.',
      );
    }
  }

  private readStoredConsent(version: string): boolean {
    try {
      const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!raw) return false;
      const record = JSON.parse(raw) as ConsentRecord;
      return record?.policyVersion === version;
    } catch {
      return false;
    }
  }

  private persistConsent(version: string): void {
    const record: ConsentRecord = {
      policyVersion: version,
      acceptedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
    } catch {
      // localStorage may be unavailable (private mode); ignore.
    }
  }
}
