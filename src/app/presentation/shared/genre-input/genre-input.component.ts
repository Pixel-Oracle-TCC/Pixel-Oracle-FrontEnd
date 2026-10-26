import { Component, ElementRef, forwardRef, signal, viewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { GENRE_SUGGESTIONS } from '../../analisar/pitch-options';

function fold(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

function matchesGenre(option: string, needle: string): boolean {
  if (!needle) {
    return false;
  }
  if (fold(option).startsWith(needle)) {
    return true;
  }
  return fold(option)
    .split(/[^a-z0-9]+/)
    .some((word) => word.startsWith(needle));
}

@Component({
  selector: 'app-genre-input',
  standalone: true,
  template: `
    <div class="genre-box">
      @if (genres().length) {
        <ul class="selected">
          @for (genre of genres(); track genre) {
            <li>
              <span>{{ genre }}</span>
              <button type="button" (click)="remove(genre)" [attr.aria-label]="'Remover ' + genre">×</button>
            </li>
          }
        </ul>
      }
      <input
        type="text"
        role="combobox"
        aria-autocomplete="list"
        [attr.aria-expanded]="open() && suggestions().length > 0"
        [attr.aria-activedescendant]="activeId()"
        aria-label="Gêneros"
        placeholder="Digite um gênero e pressione Enter"
        #field
        [value]="query()"
        (input)="onInput($event)"
        (keydown)="onKey($event)"
        (focus)="open.set(true)"
        (blur)="close()"
      />
      @if (open() && suggestions().length) {
        <ul class="menu" role="listbox" id="genre-suggestions">
          @for (option of suggestions(); track option; let i = $index) {
            <li
              role="option"
              [id]="'genre-option-' + i"
              [class.active]="i === active()"
              (mousedown)="pickFromMenu($event, option)"
            >
              {{ option }}
            </li>
          }
        </ul>
      }
    </div>
    <p class="hint">Sugestões da Steam aparecem enquanto você digita. Enter adiciona qualquer gênero.</p>
  `,
  styles: `
    .genre-box {
      position: relative;
      border: 1px solid var(--border-strong);
      background: var(--bg-surface);
      border-radius: var(--radius-sm);
      padding: 8px;
    }
    .genre-box:focus-within {
      border-color: rgba(56, 189, 248, 0.55);
    }
    .selected {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      list-style: none;
      margin: 0 0 8px;
      padding: 0;
    }
    .selected li {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: white;
      border-radius: 999px;
      padding: 4px 4px 4px 10px;
      background: linear-gradient(135deg, var(--blue), var(--purple));
      font-size: 13px;
    }
    .selected button {
      width: 22px;
      height: 22px;
      border: none;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.18);
      color: white;
      cursor: pointer;
      line-height: 1;
    }
    input {
      width: 100%;
      border: none;
      background: transparent;
      color: var(--text-primary);
      font: inherit;
      font-size: 15px;
      padding: 6px 4px;
    }
    input:focus {
      outline: none;
    }
    .menu {
      position: absolute;
      z-index: 5;
      left: 0;
      right: 0;
      top: calc(100% + 6px);
      margin: 0;
      padding: 6px;
      list-style: none;
      background: var(--bg-card);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-sm);
      box-shadow: var(--shadow-card);
      max-height: 240px;
      overflow: auto;
    }
    .menu li {
      padding: 8px 10px;
      border-radius: 6px;
      cursor: pointer;
    }
    .menu li.active,
    .menu li:hover {
      background: rgba(56, 189, 248, 0.12);
    }
    .hint {
      margin: 8px 0 0;
      font-size: 12px;
      color: var(--text-muted);
    }
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GenreInputComponent),
      multi: true,
    },
  ],
})
export class GenreInputComponent implements ControlValueAccessor {
  private readonly field = viewChild<ElementRef<HTMLInputElement>>('field');
  readonly genres = signal<string[]>([]);
  readonly query = signal('');
  readonly open = signal(false);
  readonly active = signal(0);
  readonly suggestions = signal<string[]>([]);

  private onChange: (value: string[]) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: string[] | null): void {
    this.genres.set(Array.isArray(value) ? [...value] : []);
    this.refreshSuggestions();
  }

  registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onInput(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.open.set(true);
    this.active.set(0);
    this.refreshSuggestions();
  }

  onKey(event: KeyboardEvent): void {
    const typed = (event.target as HTMLInputElement).value;
    const options = this.suggestions();
    if (event.key === 'ArrowDown' && options.length) {
      event.preventDefault();
      this.open.set(true);
      this.active.update((index) => (index + 1) % options.length);
      return;
    }
    if (event.key === 'ArrowUp' && options.length) {
      event.preventDefault();
      this.active.update((index) => (index - 1 + options.length) % options.length);
      return;
    }
    if (event.key === 'Escape') {
      this.open.set(false);
      return;
    }
    if (event.key === 'Backspace' && typed === '' && this.genres().length) {
      this.remove(this.genres()[this.genres().length - 1]);
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      const highlighted = this.open() ? options[this.active()] : undefined;
      this.add(highlighted ?? typed);
      return;
    }
    if (event.key === ',') {
      event.preventDefault();
      this.add(typed);
    }
  }

  pickFromMenu(event: Event, option: string): void {
    event.preventDefault();
    this.add(option);
  }

  remove(genre: string): void {
    this.commit(this.genres().filter((item) => fold(item) !== fold(genre)));
  }

  close(): void {
    this.open.set(false);
    this.onTouched();
  }

  activeId(): string | null {
    return this.open() && this.suggestions().length ? `genre-option-${this.active()}` : null;
  }

  private add(raw: string): void {
    const text = raw.replace(/,/g, '').trim().replace(/\s+/g, ' ');
    if (!text) {
      return;
    }
    const known = GENRE_SUGGESTIONS.find((option) => fold(option) === fold(text));
    const label = known ?? text;
    if (this.genres().some((item) => fold(item) === fold(label))) {
      this.clearQuery();
      this.refreshSuggestions();
      return;
    }
    this.commit([...this.genres(), label]);
    this.clearQuery();
    this.active.set(0);
    this.open.set(false);
    this.refreshSuggestions();
  }

  private clearQuery(): void {
    this.query.set('');
    const input = this.field()?.nativeElement;
    if (input) {
      input.value = '';
    }
  }

  private commit(next: string[]): void {
    this.genres.set(next);
    this.onChange(next);
    this.onTouched();
  }

  private refreshSuggestions(): void {
    const selected = new Set(this.genres().map(fold));
    const needle = fold(this.query());
    const matches =
      needle === ''
        ? []
        : GENRE_SUGGESTIONS.filter(
            (option) => !selected.has(fold(option)) && matchesGenre(option, needle),
          );
    this.suggestions.set(matches.slice(0, 8));
    if (this.active() >= this.suggestions().length) {
      this.active.set(0);
    }
  }
}
