import { Effect, Ref } from 'effect';

type Subscriber = () => void;

/**
 * A reactive signal that stores a value and notifies subscribers on change.
 *
 * @template A The type of the stored value.
 */
class Signal<A> {
  private readonly value: Ref.Ref<A>;
  private readonly subscribers: Ref.Ref<Set<Subscriber>>;

  constructor(initial: A) {
    this.value = Ref.unsafeMake(initial);
    this.subscribers = Ref.unsafeMake(new Set());
  }

  /**
   * Reads the current value of the signal.
   */
  get(): Effect.Effect<A> {
    return Ref.get(this.value);
  }

  /**
   * Sets a new value and notifies all subscribers.
   *
   * @param next The new value to assign to the signal.
   */
  set(next: A): Effect.Effect<void> {
    const valueRef = this.value;
    const subsRef = this.subscribers;

    return Effect.gen(function* () {
      yield* Ref.set(valueRef, next);
      const subs = yield* Ref.get(subsRef);
      subs.forEach((fn) => fn());
    });
  }

  /**
   * Applies a function to update the current signal value.
   *
   * @param f - The function that takes the old value and returns the new one.
   */
  update(f: (prev: A) => A): Effect.Effect<void> {
    const valueRef = this.value;
    const subsRef = this.subscribers;

    return Effect.gen(function* () {
      yield* Ref.set(valueRef, f(yield* valueRef));
      const subs = yield* Ref.get(subsRef);
      subs.forEach((fn) => fn());
    });
  }

  /**
   * Subscribes a function to be called when the signal changes.
   *
   * @param fn The subscriber callback.
   */
  subscribe(fn: Subscriber): Effect.Effect<void> {
    return Ref.update(this.subscribers, (subs) => {
      const next = new Set(subs);
      next.add(fn);
      return next;
    });
  }

  /**
   * Unsubscribes a previously registered callback.
   *
   * @param fn The subscriber callback to remove.
   */
  unsubscribe(fn: Subscriber): Effect.Effect<void> {
    return Ref.update(this.subscribers, (subs) => {
      const next = new Set(subs);
      next.delete(fn);
      return next;
    });
  }
}

/**
 * Creates a new reactive signal.
 *
 * @template A The type of the signal value.
 * @param initial The initial value.
 */
export const useSignal = <A>(initial: A): Signal<A> => new Signal(initial);

/**
 * Creates a DOM node that automatically re-renders whenever the signal changes.
 *
 * @template A The type of the signal value.
 * @param signal The signal to observe.
 * @param render A render function that produces a DOM node from the current value.
 * @returns An effect that returns a dynamic DOM node bound to the signal.
 */
export const withSignal = <A>(
  signal: Signal<A>,
  render: (value: A) => Effect.Effect<Node>
): Effect.Effect<Node> =>
  Effect.async<Node>((resume) => {
    let currentNode: Node;

    Effect.runPromise(
      signal.get().pipe(
        Effect.flatMap(render),
        Effect.tap((node) =>
          Effect.sync(() => {
            currentNode = node;
            resume(Effect.succeed(node));
          })
        )
      )
    );

    void Effect.runPromise(
      signal.subscribe(() => {
        Effect.runPromise(
          signal.get().pipe(
            Effect.flatMap(render),
            Effect.tap((node) =>
              Effect.sync(() => {
                if (currentNode && currentNode.parentNode) {
                  console.log(`Replacing node: ${currentNode}`);
                  currentNode.parentNode.replaceChild(node, currentNode);
                  currentNode = node;
                }
              })
            )
          )
        );
      })
    );
  });
