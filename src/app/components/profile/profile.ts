import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  template: `
    <section aria-labelledby="profile-title">
      <h1 id="profile-title">Profile</h1>
      <p role="status">No profile is loaded in this preview.</p>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class Profile {}
