const webLocalStorage = {
  set(key: string, rawValue: any) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(rawValue));
    }
  },

  get(key: string) {
    if (typeof window !== 'undefined') {
      const rawData = localStorage.getItem(key) || '';
      const data = rawData ? JSON.parse(rawData) : null;
      return data;
    }
    return null;
  },
};

export default webLocalStorage;
