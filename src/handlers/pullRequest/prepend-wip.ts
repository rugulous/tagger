import { labels } from '../../labels';

import { Handler } from '../';
import PullRequest from '../../classes/PullRequest';

export default {
  run: async entity => {
    let title = entity.data.title;
    if (!title.match(labels.wip.regex ?? '')) title = `[WIP] ${title}`;

    await entity.setTitle(title);
    await entity.setLabel(labels.wip);
  },
  triggers: ['opened', 'reopened', 'ready_for_review'],
} as Handler<PullRequest>;
