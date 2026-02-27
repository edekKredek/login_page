/* eslint-env jest */
// Tests for mocking viewport and media queries in JSDOM

function createMatchMediaMock() {
  const listeners = [];

  function evalQuery(query, width) {
    // very small parser for common queries used in the project
    // supports (max-width: Npx), (min-width: Npx), and combined with and
    const parts = query.split('and').map((p) => p.trim());
    let ok = true;
    for (const part of parts) {
      const mMax = part.match(/max-width:\s*(\d+)px/);
      const mMin = part.match(/min-width:\s*(\d+)px/);
      if (mMax) {
        const n = Number(mMax[1]);
        if (!(width <= n)) ok = false;
      }
      if (mMin) {
        const n = Number(mMin[1]);
        if (!(width >= n)) ok = false;
      }
      // allow plain queries like (min-width: 600px)
    }
    return ok;
  }

  function matchMedia(query) {
    const obj = {
      matches: false,
      media: query,
      onchange: null,
      listeners: new Set(),
      addListener(fn) {
        // deprecated API
        this.listeners.add(fn);
      },
      removeListener(fn) {
        this.listeners.delete(fn);
      },
      addEventListener(event, fn) {
        if (event !== 'change') return;
        this.listeners.add(fn);
      },
      removeEventListener(event, fn) {
        if (event !== 'change') return;
        this.listeners.delete(fn);
      },
    };

    // compute initial matches
    const width = typeof global.innerWidth === 'number' ? global.innerWidth : 1024;
    obj.matches = evalQuery(query, width);

    listeners.push({ query, obj });
    return obj;
  }

  function setWidth(width) {
    global.innerWidth = width;
    // update all listeners and fire change events
    for (const entry of listeners) {
      const { query, obj } = entry;
      const newMatch = evalQuery(query, width);
      if (newMatch !== obj.matches) {
        obj.matches = newMatch;
        const event = { matches: obj.matches, media: obj.media };
        // call listeners
        for (const fn of Array.from(obj.listeners)) {
          try {
            // modern API signature passes event
            fn.call(null, event);
          } catch (e) {
            // ignore listener errors in tests
          }
        }
        if (typeof obj.onchange === 'function') obj.onchange(event);
      }
    }
    // also dispatch resize event for components that listen to it
    global.dispatchEvent(new Event('resize'));
  }

  return { matchMedia, setWidth };
}

describe('viewport/media query mock', () => {
  let originalMatchMedia;
  let mm;
  beforeAll(() => {
    originalMatchMedia = global.matchMedia;
    mm = createMatchMediaMock();
    global.matchMedia = mm.matchMedia;
  });
  afterAll(() => {
    global.matchMedia = originalMatchMedia;
  });

  afterEach(() => {
    // reset width
    global.innerWidth = 1024;
  });

  test('matches mobile breakpoint at 400px', () => {
    mm.setWidth(400);
    expect(window.matchMedia('(max-width: 599px)').matches).toBe(true);
    expect(window.matchMedia('(min-width: 600px) and (max-width: 1023px)').matches).toBe(false);
    expect(window.matchMedia('(min-width: 1024px)').matches).toBe(false);
  });

  test('matches tablet breakpoint at 800px', () => {
    mm.setWidth(800);
    expect(window.matchMedia('(max-width: 599px)').matches).toBe(false);
    expect(window.matchMedia('(min-width: 600px) and (max-width: 1023px)').matches).toBe(true);
    expect(window.matchMedia('(min-width: 1024px)').matches).toBe(false);
  });

  test('matches desktop breakpoint at 1200px', () => {
    mm.setWidth(1200);
    expect(window.matchMedia('(max-width: 599px)').matches).toBe(false);
    expect(window.matchMedia('(min-width: 600px) and (max-width: 1023px)').matches).toBe(false);
    expect(window.matchMedia('(min-width: 1024px)').matches).toBe(true);
  });

  test('edge cases around breakpoints', () => {
    mm.setWidth(399);
    expect(window.matchMedia('(max-width: 399px)').matches).toBe(true);
    mm.setWidth(401);
    expect(window.matchMedia('(max-width: 399px)').matches).toBe(false);

    mm.setWidth(799);
    expect(window.matchMedia('(min-width: 600px) and (max-width: 799px)').matches).toBe(true);
    mm.setWidth(801);
    expect(window.matchMedia('(min-width: 600px) and (max-width: 799px)').matches).toBe(false);

    mm.setWidth(1199);
    expect(window.matchMedia('(min-width: 1024px) and (max-width: 1199px)').matches).toBe(true);
    mm.setWidth(1201);
    expect(window.matchMedia('(min-width: 1024px) and (max-width: 1199px)').matches).toBe(false);
  });

  test('listeners are notified on width change', () => {
    const mq = window.matchMedia('(max-width: 599px)');
    const handler = jest.fn();
    mq.addEventListener('change', handler);
    mm.setWidth(500); // becomes true
    expect(handler).toHaveBeenCalled();
    handler.mockReset();
    mm.setWidth(700); // becomes false
    expect(handler).toHaveBeenCalled();
  });

  test('handles undefined innerWidth without throwing', () => {
    // simulate undefined
    delete global.innerWidth;
    expect(() => mm.setWidth(400)).not.toThrow();
    // matchMedia should default to our fallback (1024) when reading innerWidth earlier
    // but calling setWidth sets it to a number; ensure it still works
    mm.setWidth(400);
    expect(window.matchMedia('(max-width: 599px)').matches).toBe(true);
  });

  test('deprecated addListener/removeListener behave correctly', () => {
    const mq = window.matchMedia('(max-width: 599px)');
    const handler = jest.fn();
    mq.addListener(handler); // deprecated API
    mm.setWidth(500);
    expect(handler).toHaveBeenCalledTimes(1);
    mq.removeListener(handler);
    mm.setWidth(700);
    expect(handler).toHaveBeenCalledTimes(1); // not called again
  });

  test('onchange property is called when present', () => {
    const mq = window.matchMedia('(max-width: 599px)');
    const handler = jest.fn();
    mq.onchange = handler;
    mm.setWidth(500);
    expect(handler).toHaveBeenCalled();
    mq.onchange = null;
  });

  test('multiple matchMedia objects for same query stay in sync and have independent listeners', () => {
    const mq1 = window.matchMedia('(max-width: 599px)');
    const mq2 = window.matchMedia('(max-width: 599px)');
    const h1 = jest.fn();
    const h2 = jest.fn();
    mq1.addEventListener('change', h1);
    mq2.addEventListener('change', h2);
    // both should reflect same matches
    mm.setWidth(500);
    expect(mq1.matches).toBe(true);
    expect(mq2.matches).toBe(true);
    expect(h1).toHaveBeenCalled();
    expect(h2).toHaveBeenCalled();
    // remove one listener
    mq1.removeEventListener('change', h1);
    h1.mockReset();
    h2.mockReset();
    mm.setWidth(700);
    expect(mq1.matches).toBe(false);
    expect(mq2.matches).toBe(false);
    expect(h1).not.toHaveBeenCalled();
    expect(h2).toHaveBeenCalled();
  });

  test('rapid sequential resize events notify listeners for each transition', () => {
    const mq = window.matchMedia('(max-width: 599px)');
    const handler = jest.fn();
    mq.addEventListener('change', handler);
    mm.setWidth(500);
    mm.setWidth(700);
    mm.setWidth(450);
    // transitions: false->true, true->false, false->true => 3 calls
    expect(handler.mock.calls.length).toBeGreaterThanOrEqual(3);
  });

  test('listener errors do not prevent other listeners from running', () => {
    const mq = window.matchMedia('(max-width: 599px)');
    const bad = jest.fn(() => { throw new Error('boom'); });
    const good = jest.fn();
    mq.addEventListener('change', bad);
    mq.addEventListener('change', good);
    expect(() => mm.setWidth(500)).not.toThrow();
    expect(good).toHaveBeenCalled();
  });
});
