import { inspectNetworkPassphrase } from '../src/services/network-validator';

describe('inspectNetworkPassphrase', () => {
  it('detects the public network by passphrase', () => {
    const result = inspectNetworkPassphrase('Public Global Stellar Network ; September 2015');

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.known).toBe(true);
    expect(result.networkName).toBe('Public Network');
    expect(result.matchedNetwork?.id).toBe('public');
  });

  it('detects testnet by alias', () => {
    const result = inspectNetworkPassphrase('testnet');

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.known).toBe(true);
    expect(result.networkName).toBe('Testnet');
  });

  it('treats custom passphrases as custom networks', () => {
    const result = inspectNetworkPassphrase('Custom Network ; Local');

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.known).toBe(false);
    expect(result.isCustom).toBe(true);
    expect(result.networkName).toBe('Custom Network');
  });

  it('rejects blank input', () => {
    const result = inspectNetworkPassphrase('   ');

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.error).toContain('empty');
  });
});
