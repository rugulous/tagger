import PullRequest from '../classes/PullRequest';
import pullRequestHandlers from './pullRequest';

export type Handler = {
  run: (entity: PullRequest) => Promise<void>;
  triggers: string[];
  priority?: number;
};

export { pullRequestHandlers };
