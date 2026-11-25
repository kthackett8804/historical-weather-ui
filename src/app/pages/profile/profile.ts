import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import type { UpdateUserRequest, User } from '../../models';
import { ApiAuthService } from '../../services/api-auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-profile',
  imports: [FormsModule],
  template: `
    <section aria-labelledby="profile-title">
      <h1 id="profile-title">Profile</h1>
      @if (loading()) {
        <p role="status">Loading profile...</p>
      } @else if (error()) {
        <p role="alert">{{ error() }}</p>
      } @else if (user(); as profile) {
        <p>Account role: {{ profile.role }}</p>
        <form (ngSubmit)="saveProfile()">
          <label for="profile-username">Username</label>
          <input id="profile-username" name="username" type="text" required
            [ngModel]="username" (input)="onUsernameInput($event)" />
          <label for="profile-email">Email</label>
          <input id="profile-email" name="email" type="email" required
            [ngModel]="email" (input)="onEmailInput($event)" />
          <button type="submit" [disabled]="saving()">Save profile</button>
          <p role="status" aria-live="polite">{{ feedback() }}</p>
        </form>
      } @else {
        <p role="status">No profile is available.</p>
      }
    </section>
  `,
  styles: `
    :host { display: block; }
    form { display: grid; gap: 0.75rem; max-width: 32rem; margin-block: 1.5rem; }
    input, button { min-height: 2.75rem; padding: 0.5rem 0.75rem; font: inherit; }
    form p { margin: 0; }
  `,
})
export class Profile implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(ApiAuthService);
  private readonly api = inject(ApiService);
  protected user = signal<User | null>(null);
  protected loading = signal(false);
  protected saving = signal(false);
  protected error = signal('');
  protected feedback = signal('');
  protected username = '';
  protected email = '';
  private userId: string | null = null;

  ngOnInit(): void {
    const routeUserId = this.route.snapshot.paramMap.get('userId');
    this.userId = routeUserId === 'me' ? this.auth.currentSession?.user_id ?? null : routeUserId;
    if (!this.userId) {
      this.error.set('Sign in again to load your profile.');
      return;
    }

    this.loading.set(true);
    this.api.getUser(this.userId).subscribe({
      next: (response) => {
        this.user.set(response.user);
        this.username = response.user.username;
        this.email = response.user.email;
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(this.errorMessage(error, 'Unable to load this profile.'));
        this.loading.set(false);
      },
    });
  }

  protected onUsernameInput(event: Event): void {
    this.username = (event.target as HTMLInputElement).value;
  }

  protected onEmailInput(event: Event): void {
    this.email = (event.target as HTMLInputElement).value;
  }

  protected saveProfile(): void {
    const profile = this.user();
    if (!this.userId || !profile) return;

    const request: UpdateUserRequest = {};
    if (this.username.trim() !== profile.username) request.username = this.username.trim();
    if (this.email.trim() !== profile.email) request.email = this.email.trim();
    if (!Object.keys(request).length) {
      this.feedback.set('No profile changes to save.');
      return;
    }

    this.saving.set(true);
    this.feedback.set('');
    this.api.updateUser(this.userId, request).subscribe({
      next: () => {
        this.user.update((current) => current ? {
          ...current,
          username: this.username.trim(),
          email: this.email.trim(),
        } : current);
        this.feedback.set('Profile updated.');
        this.saving.set(false);
      },
      error: (error: unknown) => {
        this.feedback.set(this.errorMessage(error, 'Unable to save profile changes.'));
        this.saving.set(false);
      },
    });
  }

  private errorMessage(error: unknown, fallback: string): string {
    return error instanceof HttpErrorResponse ? error.error?.message ?? fallback : fallback;
  }
}
