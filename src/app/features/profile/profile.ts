import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FinUser } from '../../core/model/fin-user.model';
import { PrivacyService } from '../../core/service/privacy';
import { AuthService } from '../../core/service/auth';

const FALLBACK_AVATAR = 'images/avatar.avif';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Profile implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly snack = inject(MatSnackBar);
  private readonly privacy = inject(PrivacyService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly finUser = signal<FinUser | null>(null);
  readonly isLoading = signal(true);
  readonly isExporting = signal(false);
  readonly isDeleting = signal(false);
  readonly confirmDelete = signal(false);
  readonly pictureUrl = signal(FALLBACK_AVATAR);

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    this.isLoading.set(true);
    this.http.get<FinUser>('/api/v1/users/profile').subscribe({
      next: (user) => {
        this.finUser.set(user);
        if (user.pictureUrl) {
          this.pictureUrl.set(user.pictureUrl);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  exportData(): void {
    if (this.isExporting()) return;
    this.isExporting.set(true);
    this.privacy.exportMyData().subscribe({
      next: (data) => {
        this.isExporting.set(false);
        this.downloadJson(data, 'my-data-export.json');
        this.snack.open('Your data export has been downloaded.', 'Dismiss', {
          duration: 4000,
          panelClass: ['snack-success'],
        });
      },
      error: () => {
        this.isExporting.set(false);
        this.snack.open('Could not export your data. Please try again later.', 'Dismiss', {
          duration: 5000,
          panelClass: ['snack-error'],
        });
      },
    });
  }

  requestDelete(): void {
    this.confirmDelete.set(true);
  }

  cancelDelete(): void {
    this.confirmDelete.set(false);
  }

  deleteAccount(): void {
    if (this.isDeleting()) return;
    this.isDeleting.set(true);
    this.privacy.deleteMyAccount().subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.confirmDelete.set(false);
        this.auth.user.set(null);
        this.snack.open('Your account has been deleted.', 'Dismiss', {
          duration: 5000,
          panelClass: ['snack-success'],
        });
        this.router.navigateByUrl('/home');
      },
      error: () => {
        this.isDeleting.set(false);
        this.snack.open('Could not delete your account. Please try again later.', 'Dismiss', {
          duration: 5000,
          panelClass: ['snack-error'],
        });
      },
    });
  }

  private downloadJson(data: unknown, filename: string): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
}
