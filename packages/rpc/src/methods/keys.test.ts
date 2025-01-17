import fetch from 'isomorphic-unfetch';
import { AccessKey, getAccessKeys } from './keys';

jest.mock('isomorphic-unfetch');

describe('keys', () => {
  const getRes = async (): Promise<AccessKey[]> => await getAccessKeys('benipsen.near');

  it('should return access keys for accounts', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({
        result: {
          keys: [
            { public_key: 'pubkey', permission: 'FullAccess' },
          ],
        },
      }),
    });
    const res = await getRes();
    expect(res.length).toBe(1);
    expect(res[0].public_key).toBe('pubkey');
    expect(res[0].permission).toBe('FullAccess');
  });

  it('should throw on returned error', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({
        result: { error: 'some error' },
      }),
    });

    await expect(getRes).rejects.toThrow('some error');
  });

  it('should throw on malformed response', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({
        result: { foo: 'bar' },
      }),
    });

    await expect(getRes).rejects.toThrow('Malformed response');
  });
});
