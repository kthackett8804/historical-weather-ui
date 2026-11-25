import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ApiService } from '../../services/api.service';
import { AdminUsers } from './admin-users';

describe('AdminUsers', () => {
  let apiServiceSpy: {
    getUsers: ReturnType<typeof vi.fn>;
    updateUserRole: ReturnType<typeof vi.fn>;
    deleteUser: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    apiServiceSpy = {
      getUsers: vi.fn().mockReturnValue(of({
        users: [{ _id: 'user-1', username: 'weather-user', email: 'user@example.com', role: 'user' }],
      })),
      updateUserRole: vi.fn().mockReturnValue(of({ message: 'User role updated successfully' })),
      deleteUser: vi.fn().mockReturnValue(of({ message: 'User deleted successfully' })),
    };

    await TestBed.configureTestingModule({
      imports: [AdminUsers],
      providers: [{ provide: ApiService, useValue: apiServiceSpy }],
    }).compileComponents();
  });

  it('loads user records from the admin API', () => {
    const fixture = TestBed.createComponent(AdminUsers);
    fixture.detectChanges();

    expect(apiServiceSpy.getUsers).toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('weather-user');
    expect(fixture.nativeElement.textContent).toContain('user@example.com');
  });

  it('updates a user role through the admin API', () => {
    const fixture = TestBed.createComponent(AdminUsers);
    fixture.detectChanges();

    const role = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    role.value = 'admin';
    role.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(apiServiceSpy.updateUserRole).toHaveBeenCalledWith('user-1', { role: 'admin' });
    expect(fixture.nativeElement.textContent).toContain('Role updated.');
  });

  it('requires confirmation before deleting a user and then removes the record', () => {
    const fixture = TestBed.createComponent(AdminUsers);
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('[data-delete-user]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(apiServiceSpy.deleteUser).not.toHaveBeenCalled();

    (fixture.nativeElement.querySelector('[data-confirm-delete]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(apiServiceSpy.deleteUser).toHaveBeenCalledWith('user-1');
    expect(fixture.nativeElement.textContent).not.toContain('weather-user');
  });
});
