import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  template: `
    <section aria-labelledby="profile-title">
      <h1 id="profile-title">Profile</h1>
      @if (userId) {
        <p>Profile preview for user: {{ userId }}</p>
      }
      <p role="status">No profile is loaded in this preview.</p>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class Profile {
  private readonly route = inject(ActivatedRoute);
  protected readonly userId = this.route.snapshot.paramMap.get('userId');
}
