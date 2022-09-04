export function createActions(store: any, actions: any) {
  for (const method in actions) {
    store[method] = actions[method];
  }
}
