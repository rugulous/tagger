import { Context } from '@actions/github/lib/context';
import { RestEndpointMethods } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types';

import GenericEvent from './GenericEvent';

import { pullRequestHandlers } from '../handlers';

export default class PullRequest extends GenericEvent {
  static async init(context: Context, rest: RestEndpointMethods) {
    if (!context.payload.pull_request) {
      throw new Error('No pull_request payload');
    }

    const { owner, repo } = context.repo;

    const { data: pullRequest } = await rest.pulls.get({
      owner,
      repo,
      pull_number: context.payload.pull_request.number,
    });

    return new PullRequest(context, rest, pullRequest, pullRequestHandlers);
  }

  async setTitle(title: string) {
    await this.rest.pulls.update({
      owner: this.owner,
      repo: this.repo,
      pull_number: this.number,
      title,
    });
  }
}
