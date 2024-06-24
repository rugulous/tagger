import { labels } from '../../labels';

import { Handler } from '../';
import PullRequest from '../../classes/PullRequest';

export default {
  run: async entity => {
    let title = entity.data.title;
    if (title.match(labels.wip.regex ?? '')) title = title.substring(6);

    await entity.setTitle(title);
    await entity.clearLabels();
  },
  triggers: ['closed', 'converted_to_draft'],
} as Handler<PullRequest>;
