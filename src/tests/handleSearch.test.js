import { handleSearch } from '../client/js/app';

describe('Testing the search functionality', () => {
  test('It should return true', () => {
    expect(handleSearch).toBeDefined();
  });
});