// Lesson 02: objects, destructuring and spread.
// Replace each `throw`, then run the tests. Don't change the arguments you're given.

/**
 * "First Last" from { first, last }. Destructure in the parameter list.
 * fullName({ first: "Ada", last: "Lovelace" }) → "Ada Lovelace"
 */
export function fullName(person) {
  throw new Error('TODO: fullName');
}

/**
 * Fill in defaults: retries 3, verbose false, timeoutMs 1000.
 * Values in `options` win, even falsy ones like 0 or false.
 * withDefaults({ retries: 0 }) → { retries: 0, verbose: false, timeoutMs: 1000 }
 */
export function withDefaults(options) {
  throw new Error('TODO: withDefaults');
}

/**
 * A new object with only the given keys (keys missing from obj are skipped).
 * pick({ a: 1, b: 2, c: 3 }, ["a", "c", "z"]) → { a: 1, c: 3 }
 */
export function pick(obj, keys) {
  throw new Error('TODO: pick');
}

/**
 * Apply `changes` to `user` without mutating it. `changes.address`, if present,
 * updates only the address fields it names.
 * updateUser({ name: "Ada", address: { city: "London", zip: "N1" } }, { address: { city: "Oslo" } })
 *   → { name: "Ada", address: { city: "Oslo", zip: "N1" } }
 */
export function updateUser(user, changes) {
  throw new Error('TODO: updateUser');
}
