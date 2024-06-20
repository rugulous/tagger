import { Context } from '@actions/github/lib/context';
import { RestEndpointMethods } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types';

import PullRequest from './PullRequest';

export default class Entity {
  context: Context;
  rest: RestEndpointMethods;

  constructor(context: Context, rest: RestEndpointMethods) {
    this.context = context;
    this.rest = rest;
  }

  async getEventEntity() {
    switch (this.context.eventName) {
      case 'pull_request_review':
      case 'pull_request_target':
      case 'pull_request':
        return await PullRequest.init(this.context, this.rest);
        break;
      default:
        throw new Error(`Unknown eventName ${this.context.eventName}`);
        break;
    }
  }
}
