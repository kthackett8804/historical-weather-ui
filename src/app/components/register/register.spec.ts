import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Register } from './register';

async function setValue(
  fixture: ComponentFixture<Register>,
  name: string,
  value: string,
): Promise<void> {
  const input = fixture.nativeElement.querySelector(`[name="${name}"]`) as HTMLInputElement;
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  await fixture.whenStable();
  fixture.detectChanges();
}

async function submit(fixture: ComponentFixture<Register>): Promise<void> {
  fixture.nativeElement
    .querySelector('form')
    .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  await fixture.whenStable();
  fixture.detectChanges();
}

describe('Register', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('shows required-field errors and no disconnected notice for an empty submit', async () => {
    const fixture = TestBed.createComponent(Register);
    fixture.detectChanges();

    await submit(fixture);

    expect(fixture.nativeElement.querySelector('#username-error')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#email-error')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#password-error')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[role="status"]')).toBeNull();
  });

  it('rejects a malformed email address', async () => {
    const fixture = TestBed.createComponent(Register);
    fixture.detectChanges();

    await setValue(fixture, 'username', 'new-user');
    await setValue(fixture, 'email', 'not-an-email');
    await setValue(fixture, 'password', 'example-password');
    await submit(fixture);

    expect(fixture.nativeElement.querySelector('#email-error')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#username-error')).toBeNull();
    expect(fixture.nativeElement.querySelector('#password-error')).toBeNull();
    expect(fixture.nativeElement.querySelector('[role="status"]')).toBeNull();
  });

  it('shows a disconnected notice for valid input and links to login', async () => {
    const fixture = TestBed.createComponent(Register);
    fixture.detectChanges();

    await setValue(fixture, 'username', 'new-user');
    await setValue(fixture, 'email', 'person@example.com');
    await setValue(fixture, 'password', 'example-password');
    await submit(fixture);

    expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain(
      'Registration is not connected',
    );
    expect(fixture.nativeElement.querySelector('app-shell')).toBeNull();
    expect(
      fixture.nativeElement.querySelector('a[routerLink="/login"]')?.getAttribute('href'),
    ).toBe('/login');
  });

  it('omits standalone account navigation when embedded', () => {
    const fixture = TestBed.createComponent(Register);
    fixture.componentRef.setInput('embedded', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('main')).toBeNull();
    expect(fixture.nativeElement.querySelector('a[routerLink="/login"]')).toBeNull();
  });
});
