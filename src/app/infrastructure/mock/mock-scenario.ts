import { Injectable, signal } from '@angular/core';

/** Cenário do protótipo. Só o adapter mockado lê este estado. */
@Injectable({ providedIn: 'root' })
export class MockScenario {
  readonly insufficient = signal(false);
}
