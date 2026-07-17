if (typeof window !== 'undefined') {
  try {
    // Check if fetch is already defined directly or on prototype
    let descriptor = Object.getOwnPropertyDescriptor(window, 'fetch');
    
    // If not direct, check prototype
    if (!descriptor) {
      let proto = Object.getPrototypeOf(window);
      while (proto) {
        descriptor = Object.getOwnPropertyDescriptor(proto, 'fetch');
        if (descriptor) break;
        proto = Object.getPrototypeOf(proto);
      }
    }

    if (descriptor && !descriptor.writable) {
      Object.defineProperty(window, 'fetch', {
        value: descriptor.value,
        writable: true,
        configurable: true,
        enumerable: descriptor.enumerable
      });
    }

    // Intercept window.fetch to protect against environments where response.headers is stripped of its prototype/methods (e.g. in sandbox iframes)
    const originalFetch = window.fetch;
    if (originalFetch) {
      window.fetch = async function(...args) {
        const res = await originalFetch.apply(this, args);
        if (!res) return res;

        // Ensure headers has the standard forEach method if it exists but is missing the prototype function
        if (res.headers && typeof res.headers.forEach !== 'function') {
          let parsedHeaders: Headers | null = null;
          try {
            parsedHeaders = new Headers();
            if (typeof (res.headers as any)[Symbol.iterator] === 'function') {
              for (const [key, val] of (res.headers as any)) {
                parsedHeaders.set(key, String(val));
              }
            } else {
              for (const [key, val] of Object.entries(res.headers)) {
                parsedHeaders.set(key, String(val));
              }
            }
          } catch (err) {
            console.warn("Failed to convert headers to standard Headers object", err);
          }

          return new Proxy(res, {
            get(target, prop, receiver) {
              if (prop === 'headers') {
                const headers = parsedHeaders || target.headers;
                // Ensure forEach exists
                if (typeof headers.forEach !== 'function') {
                  headers.forEach = function(callback: any, thisArg: any) {
                    if (typeof (headers as any)[Symbol.iterator] === 'function') {
                      for (const [key, val] of (headers as any)) {
                        callback.call(thisArg, val, key, headers);
                      }
                    } else if (typeof Object.entries === 'function') {
                      for (const [key, val] of Object.entries(headers)) {
                        callback.call(thisArg, val, key, headers);
                      }
                    }
                  };
                }
                return headers;
              }
              const val = Reflect.get(target, prop, receiver);
              if (typeof val === 'function') {
                return val.bind(target);
              }
              return val;
            }
          });
        }
        return res;
      };
    }

    // Ensure Headers prototype has forEach
    if (window.Headers && typeof window.Headers.prototype.forEach !== 'function') {
      window.Headers.prototype.forEach = function(callback: any, thisArg: any) {
        for (const [key, val] of (this as any).entries()) {
          callback.call(thisArg, val, key, this);
        }
      };
    }
  } catch (e) {
    console.warn('Could not make window.fetch writable', e);
  }
  
  // Silencing Analytics SDK error
  const originalError = console.error;
  console.error = (...args) => {
    if (args[0] && typeof args[0] === 'string' && args[0].includes('Analytics SDK')) {
      return;
    }
    originalError.apply(console, args);
  };
}
