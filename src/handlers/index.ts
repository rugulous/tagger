import GenericEvent from '../classes/GenericEvent';
import PullRequest from '../classes/PullRequest';
import { EventHandler } from './EventHandler';
import pullRequestHandlers from './pullRequest';

export type Handler<T extends GenericEvent> = {
  run: (entity: T) => Promise<void>;
  triggers: string[];
  priority?: number;
};

const prHandler = new EventHandler(pullRequestHandlers, (x: GenericEvent): x is PullRequest => 'setTitle' in x);

export const handlers = [prHandler];
