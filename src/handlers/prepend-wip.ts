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

    let title = pullRequest.title;
    if (!title.match(labels.wip.regex ?? '')) title = `[WIP] ${title}`;

    try {
      await rest.pulls.update({
        owner,
        repo,
        pull_number: pullNumber,
        title,
      });

      console.log(`Updated title on PR #${pullNumber}`);
    } catch (error) {
      if (error instanceof Error)
        console.error(
          `Failed to update title on PR #${pullNumber}: ${error.message}`,
        );

      return false;
    }

    try {
      await rest.issues.setLabels({
        owner,
        repo,
        issue_number: pullNumber,
        labels: [labels.wip.name],
      });

      console.log(`Added WIP label to PR #${pullNumber}`);
    } catch (error) {
      if (error instanceof Error)
        console.error(
          `Failed to add WIP label to PR #${pullNumber}: ${error.message}`,
        );
    }

    return true;
  },
  triggers: ['opened', 'reopened', 'ready_for_review'],
} as Handler;
