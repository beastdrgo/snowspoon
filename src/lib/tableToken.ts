import crypto from "crypto";

/**
 * Signs table numbers so table-order QR codes can't be forged or tampered with.
 * Each QR carries `?table=N&k=<code>` where `code` is an HMAC of the table
 * number. Changing the table number invalidates the code, and a valid code
 * can't be produced without ORDER_TABLE_SECRET.
 *
 * Server-only — this imports node:crypto and must never be pulled into a
 * client component.
 */
const SECRET = process.env.ORDER_TABLE_SECRET ?? "";
const CODE_LEN = 12;

/** The signed hashcode for a given table number. */
export function tableCode(table: string): string {
  return crypto
    .createHmac("sha256", SECRET)
    .update(`table:${table}`)
    .digest("hex")
    .slice(0, CODE_LEN);
}

/** True only when `code` is the correct signature for `table`. */
export function verifyTable(table: string | null | undefined, code: string | null | undefined): boolean {
  if (!SECRET || !table || !code) return false;
  const expected = tableCode(table);
  if (code.length !== expected.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(code), Buffer.from(expected));
  } catch {
    return false;
  }
}
