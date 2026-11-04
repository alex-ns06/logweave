/** JSON.stringify que nunca lança (referências circulares, BigInt etc.). */
export function safeJson(value: unknown): string {
  try {
    return JSON.stringify(value, (_k, v) => (typeof v === "bigint" ? v.toString() : v));
  } catch {
    return '"[unserializable]"';
  }
}
