import { BranchNamePipe } from './branch-name.pipe';

describe('BranchNamePipe', () => {
  it('create an instance', () => {
    const pipe = new BranchNamePipe();
    expect(pipe).toBeTruthy();
  });
});
