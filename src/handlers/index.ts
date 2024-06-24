import GenericEvent from '../classes/GenericEvent';
import PullRequest from '../classes/PullRequest';
import { PrEventHandler } from './EventHandler';
import pullRequestHandlers from './pullRequest';

export type Handler<T extends GenericEvent> = {
  run: (entity: T) => Promise<void>;
  triggers: string[];
  priority?: number;
};

const prHandler = new PrEventHandler(pullRequestHandlers);

export const handlers = [prHandler];
