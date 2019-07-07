import { Batch } from './Batch';

describe('Batch', () => {
  it('should create an instance', () => {
    expect(new Batch(0, '', 0, {})).toBeTruthy();
  });

  it('should return true', () => {
    const batch = new Batch(0, '', 0, { product_id: 1 });
    expect(batch.isPrimarily('product')).toBeTruthy();
  });
});
