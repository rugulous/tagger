const github = {
  context: {
    repo: {
      owner: 'test-owner',
      repo: 'test-repo',
    },
    payload: {
      pull_request: {
        number: 1,
      },
    },
  },
  getOctokit: jest.fn(() => ({
    rest: {
      pulls: {
        get: jest.fn().mockResolvedValue({
          data: {
            number: 1,
            state: 'open',
            title: 'Test Pull Request',
          },
        }),
      },
    },
  })),
};

export default github;
module.exports = github;
