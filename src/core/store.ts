type Listener<T> = (state: T) => void;

export class Store<T extends object> {
  private state: T;
  private listeners = new Set<Listener<T>>();

  constructor(initial: T) {
    this.state = initial;
  }

  get(): T {
    return this.state;
  }

  set(patch: Partial<T>): void {
    this.state = {...this.state, ...patch};
    this.emit();
  }

  update(mutator: (draft: T) => void): void {
    mutator(this.state);
    this.emit();
  }

  subscribe(listener: Listener<T>): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(): void {
    for(const listener of this.listeners) listener(this.state);
  }
}
