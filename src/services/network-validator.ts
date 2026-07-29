import { Networks } from '@stellar/stellar-sdk';

export interface StellarNetworkDefinition {
  id: string;
  name: string;
  passphrase: string;
  aliases: string[];
}

export interface NetworkInspectionResult {
  ok: true;
  input: string | null;
  availableNetworks: StellarNetworkDefinition[];
  matchedNetwork: StellarNetworkDefinition | null;
  known: boolean;
  networkName: string;
  passphrase: string;
  isCustom: boolean;
}

export interface NetworkInspectionError {
  ok: false;
  error: string;
}

export type NetworkInspectionOutcome = NetworkInspectionResult | NetworkInspectionError;

export function getAvailableNetworks(): StellarNetworkDefinition[] {
  return [
    {
      id: 'public',
      name: 'Public Network',
      passphrase: Networks.PUBLIC,
      aliases: ['public', 'mainnet', 'pub', 'public network', 'stellar'],
    },
    {
      id: 'testnet',
      name: 'Testnet',
      passphrase: Networks.TESTNET,
      aliases: ['testnet', 'test', 'test-net', 'test network'],
    },
    {
      id: 'futurenet',
      name: 'Futurenet',
      passphrase: Networks.FUTURENET,
      aliases: ['futurenet', 'future', 'future-net', 'future network'],
    },
  ];
}

function normalizeInput(value: string): string {
  return value.trim().toLowerCase();
}

export function inspectNetworkPassphrase(input?: string): NetworkInspectionOutcome {
  if (input === undefined) {
    return {
      ok: true,
      input: null,
      availableNetworks: getAvailableNetworks(),
      matchedNetwork: null,
      known: false,
      networkName: 'Available Networks',
      passphrase: '',
      isCustom: false,
    };
  }

  const trimmed = input.trim();
  if (!trimmed) {
    return {
      ok: false,
      error: 'Passphrase must not be empty.',
    };
  }

  const availableNetworks = getAvailableNetworks();
  const normalizedInput = normalizeInput(trimmed);
  const matchedNetwork = availableNetworks.find((network) => {
    if (normalizeInput(network.passphrase) === normalizedInput) {
      return true;
    }

    return network.aliases.some((alias) => normalizeInput(alias) === normalizedInput);
  });

  if (matchedNetwork) {
    return {
      ok: true,
      input: trimmed,
      availableNetworks,
      matchedNetwork,
      known: true,
      networkName: matchedNetwork.name,
      passphrase: matchedNetwork.passphrase,
      isCustom: false,
    };
  }

  return {
    ok: true,
    input: trimmed,
    availableNetworks,
    matchedNetwork: null,
    known: false,
    networkName: 'Custom Network',
    passphrase: trimmed,
    isCustom: true,
  };
}
