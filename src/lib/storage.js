// Persistenz über localStorage des Browsers (läuft ohne Server/Backend).
// Bietet dieselbe kleine async-API wie die ursprüngliche Sandbox-Storage,
// damit der Rest der App unverändert `await` nutzen kann.
export const storage = {
  async get(key) {
    const value = window.localStorage.getItem(key);
    return value === null ? null : { value };
  },
  async set(key, value) {
    window.localStorage.setItem(key, value);
  },
};

export const STORAGE_KEY = "fenster-aufmass:v1";
