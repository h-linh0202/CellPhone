// ...existing code...
const API_BASE_URL = 'https://api.apify.com/v2/key-value-stores/Dk3WYwoH9GqWLc6Cm/records/LATEST';

const normalizeData = (data) => {
  if (!data) return null;
  if (Array.isArray(data)) return { phone: { Demo: data } };
  if (typeof data === 'object' && data.phone) return data;
  for (const k of Object.keys(data || {})) {
    if (Array.isArray(data[k])) return { phone: { [k]: data[k] } };
  }
  return null;
};

/**
 * Fetch JSON with timeout and clear errors for debugging.
 */
const fetchWithTimeout = async (url, { timeoutMs = 8000, opts = {} } = {}) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: 'GET',
      cache: 'no-store',
      mode: 'cors',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
      ...opts
    });

    const text = await res.text().catch(() => '');
    if (!res.ok) {
      const err = new Error(`HTTP ${res.status} ${res.statusText}`);
      err.status = res.status;
      err.body = text;
      throw err;
    }

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      const e = new Error(`Timeout after ${timeoutMs}ms`);
      e.name = 'TimeoutError';
      throw e;
    }
    throw err;
  } finally {
    clearTimeout(id);
  }
};

export const fetchProducts = async () => {
  const url = `${API_BASE_URL}?t=${Date.now()}`;

  try {
    // Direct call to the provided API URL
    const data = await fetchWithTimeout(url, { timeoutMs: 10000 });
    const norm = normalizeData(data);
    if (!norm) {
      const e = new Error('Unexpected data shape from API');
      e.raw = data;
      throw e;
    }
    return norm;
  } catch (err) {
    // Attach environment info to help debugging in browser console
    const detailed = {
      message: err.message,
      name: err.name,
      stack: err.stack,
      online: typeof navigator !== 'undefined' ? navigator.onLine : null,
      url,
      errorBody: err.body ?? err.raw ?? null
    };
    console.error('❌ Error fetching products:', detailed);
    // Re-throw with details property so caller (UI) can show debug info
    const out = new Error('Failed to fetch products');
    out.details = detailed;
    throw out;
  }
};

export const getCategories = (data) => {
  if (!data || !data.phone) return [];
  return Object.keys(data.phone || {})
    .filter(k => Array.isArray(data.phone[k]) && data.phone[k].length > 0)
    .map(k => ({
      name: k,
      count: Array.isArray(data.phone[k]) ? data.phone[k].length : 0,
      products: data.phone[k]
    }));
};

export const getProductsByCategory = (data, categoryName) => {
  if (!data || !data.phone || !categoryName) return [];
  const products = data.phone[categoryName];
  if (!Array.isArray(products)) return [];
  return products;
};
// ...existing code...