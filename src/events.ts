import { Effect, Ref } from 'effect';

type EventHandler = (event: Event) => void;

const eventRegistry = new Map<string, EventHandler>();

export const registerEvent = (key: string, handler: EventHandler) => {
  eventRegistry.set(key, handler);
};

const eventIdCounter = Ref.unsafeMake(0);

export const generateEventId = Effect.gen(function* () {
  const next = yield* Ref.updateAndGet(eventIdCounter, (n) => n + 1);
  return `event-${next}`;
});

const activeListeners = new Set<string>();

export const ensureDelegatedListener = (type: string) => {
  if (activeListeners.has(type)) return;

  document.addEventListener(type, (event) => {
    const target = event.target as HTMLElement | null;
    const key = target?.getAttribute(`data-${type}-event`);
    if (!key) return;

    const handler = eventRegistry.get(key);
    if (handler) handler(event);
  });

  activeListeners.add(type);
};

export const getCachedEventId = Effect.cachedFunction(
  (effect: Effect.Effect<void>) =>
    Effect.gen(function* () {
      const id = yield* generateEventId;
      registerEvent(id, () => void Effect.runPromise(effect));
      return id;
    })
);
