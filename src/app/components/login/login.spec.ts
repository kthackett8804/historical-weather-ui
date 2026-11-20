import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Login } from './login';

async function setValue(
  fixture: ComponentFixture<Login>,
  name: string,
  value: string,
): Promise<void> {
  const input = fixture.nativeElement.querySelector(`[name="${name}"]`) as HTMLInputElement;
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  await fixture.whenStable();
  fixture.detectChanges();
}

async function submit(fixture: ComponentFixture<Login>): Promise<void> {
  fixture.nativeElement
    .querySelector('form')
    .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  await fixture.whenStable();
  fixture.detectChanges();
}

describe('Login', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('shows required-field errors and no disconnected notice for an empty submit', async () => {
    const fixture = TestBed.createComponent(Login);
    fixture.detectChanges();

    await submit(fixture);

    expect(fixture.nativeElement.querySelector('#email-error')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#password-error')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[role="status"]')).toBeNull();
  });

  it('rejects a malformed email address', async () => {
    const fixture = TestBed.createComponent(Login);
    fixture.detectChanges();

    await setValue(fixture, 'email', 'not-an-email');
    await setValue(fixture, 'password', 'example-password');
    await submit(fixture);

    expect(fixture.nativeElement.querySelector('#email-error')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#password-error')).toBeNull();
    expect(fixture.nativeElement.querySelector('[role="status"]')).toBeNull();
  });

  it('shows a disconnected notice for valid input and links to registration', async () => {
    const fixture = TestBed.createComponent(Login);
    fixture.detectChanges();

    await setValue(fixture, 'email', 'person@example.com');
    await setValue(fixture, 'password', 'example-password');
    await submit(fixture);

    expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain(
      'Authentication is not connected',
    );
    expect(fixture.nativeElement.querySelector('app-shell')).toBeNull();
    expect(
      fixture.nativeElement.querySelector('a[routerLink="/register"]')?.getAttribute('href'),
    ).toBe('/register');
  });

  it('omits standalone account navigation when embedded', () => {
    const fixture = TestBed.createComponent(Login);
    fixture.componentRef.setInput('embedded', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('main')).toBeNull();
    expect(fixture.nativeElement.querySelector('a[routerLink="/register"]')).toBeNull();
  });
});
