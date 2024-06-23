import { Context } from '@actions/github/lib/context';
import { RestEndpointMethods } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types';
import { components } from '@octokit/openapi-types';

import { Handler } from '../handlers';
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
  handlers: Handler[];
  number: number;

  constructor(
    context: Context,
    rest: RestEndpointMethods,
    data: OctokitPullRequest,
    handlers: Handler[],
  ) {
    this.context = context;
    this.rest = rest;
    this.data = data;
    this.owner = context.repo.owner;
    this.repo = context.repo.repo;
    this.eventName = context.eventName;
    this.trigger = context.payload.action ?? '';
    this.number = data.number;
    this.handlers = handlers;
  }

  get manualLabels() {
    const labelNames = Object.values(labels).map(l => l.name);
    const manualLabels = this.data.labels
      .map(l => l.name)
      .filter(l => !labelNames.includes(l));

    return manualLabels;
  }

  async runHandlers() {
    const handlers = this.handlers
      .filter(h => h.triggers.includes(this.trigger ?? ''))
      .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));

    console.log(`eventName: ${this.eventName}`);
    console.log(`trigger: ${this.trigger}`);
    console.log(this.context);
    console.log(`found ${handlers.length} handlers`);

    for (const h of handlers) {
      await h.run(this);
    }
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
