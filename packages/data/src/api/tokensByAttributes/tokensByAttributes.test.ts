import { META_SERVICE_HOST_TESTNET } from '../../constants';
import { ParsedDataReturn } from '../../types';
import { FilteredMetadataQueryResult, tokensByAttributes, tokensByAttributesThrowOnError } from './tokensByAttributes';

import fetchMock from 'fetch-mock';
import { mbjs } from '@mintbase-js/sdk';

describe('tokensByAttributes', () => {
  beforeAll(() => {
    mbjs.config({ network: 'testnet' });
  });

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
      // console.log('Suppressed console error.');
    });
  });

  it('returns data and converts ', async () => {
    fetchMock.mock(`begin:${META_SERVICE_HOST_TESTNET}`, { body: { results: [{ token_id: '123' }] } });
    const query = {
      filters: {
        'eyes': ['blue', 'green'],
        'face': ['busted'],
      },
      limit: 10,
      offset: 0,
    };
    const { data } = await tokensByAttributes('contract.id', query) as ParsedDataReturn<FilteredMetadataQueryResult>;
    expect(data).toBeDefined();
    expect(data?.results[0].tokenId).toBeDefined();
  });

  it('returns errors', async () => {
    fetchMock.mock(`begin:${META_SERVICE_HOST_TESTNET}`, 504, { overwriteRoutes: true });
    const query = {
      filters: {
        'eyes': ['blue', 'green'],
        'face': ['busted'],
      },
      limit: 10,
      offset: 0,
    };
    const { error } = await tokensByAttributes('contract.id', query);
    expect(error).toBeDefined();
  });

  it('throws errors when unwrapped version is called', () => {
    fetchMock.mock(`begin:${META_SERVICE_HOST_TESTNET}`, 504, { overwriteRoutes: true });
    const query = {
      filters: {
        'eyes': ['blue', 'green'],
        'face': ['busted'],
      },
      limit: 10,
      offset: 0,
    };
    expect(tokensByAttributesThrowOnError('contract.id', query)).rejects.toBeDefined();
  });
});
