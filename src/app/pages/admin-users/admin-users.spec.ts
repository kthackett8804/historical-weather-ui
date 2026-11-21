import { TestBed } from '@angular/core/testing';
import { AdminUsers } from './admin-users';

describe('AdminUsers', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AdminUsers] }).compileComponents();
  });

  it('explains that no user records are available in this preview', () => {
    const fixture = TestBed.createComponent(AdminUsers);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('User Management');
    expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain(
      'No user records are available in this preview',
    );
  });
});
