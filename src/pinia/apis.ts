export function patch(value: any) {
  const store = this;
  for (const key in value) {
    store[key] = value[key];
  }
}
