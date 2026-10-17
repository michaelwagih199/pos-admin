// Global test setup for the Vitest runner of the `@angular/build:unit-test` builder.
//
// The previous Karma entry point is gone: `main`, `karmaConfig`, `polyfills` and `styles`
// no longer drive the test target (they are inherited from the `build` target instead).
//
// What the builder provides on its own, so this file must NOT do it:
//   - it initializes the Angular TestBed environment (`getTestBed().initTestEnvironment(...)`),
//   - it injects `zone.js/testing` when the build target's polyfills contain `zone.js`,
//   - it registers the TestBed cleanup hooks (`beforeEach` / `afterEach`),
//   - it discovers every `**/*.spec.ts` file; there is no `require.context` entry point.
//
// Only global, test-only setup belongs here. `@angular/localize/init` is already pulled in
// by `src/polyfills.ts` (part of the inherited build target), so nothing is required today.
