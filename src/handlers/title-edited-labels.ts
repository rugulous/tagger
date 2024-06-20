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
    const title = pullRequest.title;

    if (pullRequest.state !== 'open') {
      console.log(`Skipping ${pullRequest.state} pr`);
      return true;
    }

    const prLabelsFiltered = pullRequest.labels
      .filter(l => l.name !== labels.wip.name)
      .map(l => l.name);
    const hasWipLabel = pullRequest.labels.length > prLabelsFiltered.length;

    if (title.match(labels.wip.regex ?? '')) {
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

        return false;
      }
    } else {
      try {
        await rest.issues.setLabels({
          owner,
          repo,
          issue_number: pullNumber,
          labels: [labels.readyForReview.name],
        });

        console.log(`Added RFR label to PR #${pullNumber}`);
      } catch (error) {
        if (error instanceof Error)
          console.error(
            `Failed to add RFR label to PR #${pullNumber}: ${error.message}`,
          );

        return false;
      }

    return true;
    }
  },
  triggers: ['edited'],
} as Handler;
