import * as core from '@actions/core';
import * as github from '@actions/github';
import { run } from '../src/index';

jest.mock('@actions/core');
jest.mock('@actions/github');

describe('run', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock for context.payload
    github.context.payload = {
      pull_request: {
        number: 1,
      },
    };
  });

  it('should fail if context is not pull request', async () => {
    (github.context.payload as any).pull_request = undefined;

    await run();

    expect(core.setFailed).toHaveBeenCalledWith('context is not pull request');
  });

  it('should call core.setFailed on error', async () => {
    (core.getInput as jest.Mock).mockReturnValue('test-token');

    (github.getOctokit as jest.Mock).mockReturnValue({
      rest: {
        pulls: {
          get: jest.fn().mockRejectedValue(new Error('Test error')),
        },
      },
    });

    await run();

    expect(core.setFailed).toHaveBeenCalledWith('Test error');
  });
});
