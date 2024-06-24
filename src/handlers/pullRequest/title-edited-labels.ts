import { labels } from '../../labels';

import { Handler } from '../';
import PullRequest from '../../classes/PullRequest';

export default {
  run: async entity => {
    const title = entity.data.title;

    if (entity.data.state !== 'open') {
      console.log(`Skipping ${entity.data.state} pr`);
      return;
    }

    if (title.match(labels.wip.regex ?? '')) {
      await entity.setLabel(labels.wip);
    } else {
      await entity.setLabel(labels.readyForReview);
    }
  },
  triggers: ['edited'],
} as Handler<PullRequest>;
