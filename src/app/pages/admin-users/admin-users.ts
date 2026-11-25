import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import type { User, UserRole } from '../../models';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-admin-users',
  template: `
    <section aria-labelledby="admin-title">
      <h1 id="admin-title">User Management</h1>
      @if (loading()) {
        <p role="status">Loading users...</p>
      } @else if (error()) {
        <p role="alert">{{ error() }}</p>
      } @else if (users().length) {
        <div class="table-wrap">
          <table>
            <caption>Registered user accounts</caption>
            <thead>
              <tr><th scope="col">Username</th><th scope="col">Email</th>
                <th scope="col">Role</th><th scope="col">Actions</th></tr>
            </thead>
            <tbody>
              @for (user of users(); track user._id) {
                <tr>
                  <th scope="row">{{ user.username }}</th>
                  <td>{{ user.email }}</td>
                  <td>
                    <label class="visually-hidden" [for]="'role-' + user._id">
                      Role for {{ user.username }}
                    </label>
                    <select [id]="'role-' + user._id" [value]="user.role"
                      (change)="changeRole(user, $event)" [disabled]="savingId() === user._id">
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    @if (pendingDeleteId() === user._id) {
                      <span>Delete {{ user.username }}?</span>
                      <button type="button" data-confirm-delete
                        (click)="deleteUser(user)" [disabled]="savingId() === user._id">
                        Confirm
                      </button>
                      <button type="button" (click)="pendingDeleteId.set(null)">Cancel</button>
                    } @else {
                      <button type="button" data-delete-user
                        (click)="pendingDeleteId.set(user._id)">Delete</button>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      } @else {
        <p role="status">No user records are available.</p>
      }
      <p role="status" aria-live="polite">{{ feedback() }}</p>
    </section>
  `,
  styles: `
    :host { display: block; }
    .table-wrap { max-width: 100%; overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; background: white; }
    th, td { padding: 0.75rem; border: 1px solid #d7e0ed; text-align: left; }
    select, button { min-height: 2.5rem; padding: 0.4rem 0.6rem; font: inherit; }
    td:last-child { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; }
    .visually-hidden {
      position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
      overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
    }
  `,
})
export class AdminUsers implements OnInit {
  private readonly api = inject(ApiService);
  protected users = signal<User[]>([]);
  protected loading = signal(false);
  protected error = signal('');
  protected feedback = signal('');
  protected savingId = signal<string | null>(null);
  protected pendingDeleteId = signal<string | null>(null);

  ngOnInit(): void {
    this.loading.set(true);
    this.api.getUsers().subscribe({
      next: (response) => {
        this.users.set(response.users);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(this.errorMessage(error, 'Unable to load users.'));
        this.loading.set(false);
      },
    });
  }

  protected changeRole(user: User, event: Event): void {
    const role = (event.target as HTMLSelectElement).value as UserRole;
    if (role === user.role) return;

    this.savingId.set(user._id);
    this.feedback.set('');
    this.api.updateUserRole(user._id, { role }).subscribe({
      next: () => {
        this.users.update((users) =>
          users.map((item) => item._id === user._id ? { ...item, role } : item),
        );
        this.feedback.set('Role updated.');
        this.savingId.set(null);
      },
      error: (error: unknown) => {
        this.feedback.set(this.errorMessage(error, 'Unable to update this role.'));
        this.savingId.set(null);
      },
    });
  }

  protected deleteUser(user: User): void {
    this.savingId.set(user._id);
    this.api.deleteUser(user._id).subscribe({
      next: () => {
        this.users.update((users) => users.filter((item) => item._id !== user._id));
        this.pendingDeleteId.set(null);
        this.feedback.set('User deleted.');
        this.savingId.set(null);
      },
      error: (error: unknown) => {
        this.feedback.set(this.errorMessage(error, 'Unable to delete this user.'));
        this.savingId.set(null);
      },
    });
  }

  private errorMessage(error: unknown, fallback: string): string {
    return error instanceof HttpErrorResponse ? error.error?.message ?? fallback : fallback;
  }
}
