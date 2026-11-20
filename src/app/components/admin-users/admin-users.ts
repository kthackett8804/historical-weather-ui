import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-users',
  template: `
    <section aria-labelledby="admin-title">
      <h1 id="admin-title">User Management</h1>
      <p role="status">No user records are available in this preview.</p>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class AdminUsers {}
