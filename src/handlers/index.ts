import { Context } from '@actions/github/lib/context';
import { RestEndpointMethods } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types';
import { components } from '@octokit/openapi-types';

type PullRequest = components['schemas']['pull-request'];

import prependWip from './prepend-wip';
import titleEditedLabels from './title-edited-labels';

export type Handler = {
  run: (
    context: Context,
    pullRequest: PullRequest,
    rest: RestEndpointMethods,
  ) => Promise<boolean>;
  triggers: string[];
  priority?: number;
};

const handlers = [prependWip, titleEditedLabels];

export default async function runHandlers(
  context: Context,
  pullRequest: PullRequest,
  rest: RestEndpointMethods,
) {
  const targetHandlers = handlers
    .filter(h => h.triggers.includes(context.payload.action ?? ''))
    .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));

  console.log(`trigger: ${context.payload.action}`);
  console.log(`found ${targetHandlers.length} handlers`);

  for (const h of targetHandlers) {
    await h.run(context, pullRequest, rest);
  }
}
