/**
 * Creates a UUID.
 * @returns UUID string
 */
export default function createID() {
  return crypto.randomUUID();
}
