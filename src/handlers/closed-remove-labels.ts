import { labels } from '../labels';

import { Handler } from '.';

export default {
  run: async (context, pullRequest, rest) => {
    if (!context.payload.repository || !context.payload.pull_request) {
      return false;
    }

    const owner = context.payload.repository.owner.login;
    const repo = context.payload.repository.name;
    const pullNumber = pullRequest.number;

    try {
      await rest.issues.setLabels({
        owner,
        repo,
        issue_number: pullNumber,
        labels: [],
      });

      console.log(`Removed label from PR #${pullNumber}`);
    } catch (error) {
      if (error instanceof Error)
        console.error(
          `Failed to remove labels from PR #${pullNumber}: ${error.message}`,
        );
    }
  },
  triggers: ['closed', 'converted_to_draft'],
} as Handler;
