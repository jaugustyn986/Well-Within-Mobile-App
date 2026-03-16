const storage = {};
function getStore() { return storage; }
global.AsyncStorageMock = storage;
global.getAsyncStorageStore = getStore;
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: async (key) => storage[key] ?? null,
  setItem: async (key, value) => { storage[key] = value; },
  removeItem: async (key) => { delete storage[key]; },
}));
