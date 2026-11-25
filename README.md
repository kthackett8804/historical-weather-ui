# HistoricalWeatherUi

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.2.7.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.
The development server proxies `/api` requests to `http://127.0.0.1:8080` using
[`proxy.conf.json`](./proxy.conf.json), so browser requests are same-origin in
development. This proxy does not configure CORS on the backend; deployments
that call the API from a different origin must allow that origin in the API's
CORS configuration.

The Flask API also supports a verified Auth0-to-API JWT exchange at
`POST /api/v1.0/auth0-login`. Before starting Flask, configure
`AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, and a random `JWT_SECRET_KEY` of at least 32
bytes. `CORS_ALLOWED_ORIGINS` can override the default local origins
(`http://localhost:4200,http://127.0.0.1:4200`). Never commit the JWT signing
key.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
