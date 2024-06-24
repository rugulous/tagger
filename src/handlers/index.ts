import GenericEvent from '../classes/GenericEvent';
import Issue from '../classes/Issue';
import { EventHandler } from './EventHandler';
import pullRequestHandlers from './pullRequest';

export type Handler<T extends GenericEvent> = {
  run: (entity: T) => Promise<void>;
  triggers: string[];
  priority?: number;
};

export const handler = new EventHandler({
  pullRequest: pullRequestHandlers,
  issue: [
    {
      run: (entity: Issue) => console.log(entity)
    } as Handler<Issue>
  ]
});
