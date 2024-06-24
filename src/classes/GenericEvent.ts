import { Context } from '@actions/github/lib/context';
import { RestEndpointMethods } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types';
import { components } from '@octokit/openapi-types';

import { Label, labels } from '../labels';

type OctokitPullRequest = components['schemas']['pull-request'];

export default class GenericEvent {
  context: Context;
  rest: RestEndpointMethods;
  data: OctokitPullRequest;
  owner: string;
  repo: string;
  eventName: string;
  trigger: string;
  number: number;

  constructor(
    context: Context,
    rest: RestEndpointMethods,
    data: OctokitPullRequest,
  ) {
    this.context = context;
    this.rest = rest;
    this.data = data;
    this.owner = context.repo.owner;
    this.repo = context.repo.repo;
    this.eventName = context.eventName;
    this.trigger = context.payload.action ?? '';
    this.number = data.number;
  }

  get manualLabels() {
    const labelNames = Object.values(labels).map(l => l.name);
    const manualLabels = this.data.labels
      .map(l => l.name)
      .filter(l => !labelNames.includes(l));

    return manualLabels;
  }

  async setLabel(label: Label) {
    await this.rest.issues.setLabels({
      owner: this.owner,
      repo: this.repo,
      issue_number: this.number,
      labels: [...this.manualLabels, label.name],
    });
  }

  async clearLabels() {
    await this.rest.issues.setLabels({
      owner: this.owner,
      repo: this.repo,
      issue_number: this.number,
      labels: this.manualLabels,
    });
  }

//  async setTitle(_title: string) {
//    throw new Error(`setTitle is not implemented for ${this.eventName}`);
//  }
}
