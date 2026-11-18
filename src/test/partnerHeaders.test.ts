import { describe, expect, it } from 'vitest'
import { normalizeSecret, upstreamHeaders } from '../../supabase/functions/_shared/partnerCore'

describe('upstream secret normalization', () => {
  it('trims whitespace and newlines', () => {
    expect(normalizeSecret('  abc123\n')).toBe('abc123')
  })
  it('removes wrapping quotes', () => {
    expect(normalizeSecret('"abc123"')).toBe('abc123')
  })
  it('removes a pasted Bearer prefix, even duplicated', () => {
    expect(normalizeSecret('Bearer abc123')).toBe('abc123')
    expect(normalizeSecret('bearer Bearer abc123')).toBe('abc123')
  })
  it('sends exactly one Bearer prefix', () => {
    const h = upstreamHeaders('Bearer  abc123 ', ' pk ')
    expect(h['OAI-Sites-Authorization']).toBe('Bearer abc123')
    expect(h['X-VP-Pickup']).toBe('pk')
  })
  it('empty secret stays empty so the function reports not configured', () => {
    expect(normalizeSecret(undefined)).toBe('')
    expect(normalizeSecret('  ')).toBe('')
  })
})
