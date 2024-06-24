import { Context } from "@actions/github/lib/context";
import GenericEvent, { EventTypes } from "./GenericEvent";
import PullRequest from "./PullRequest";
import { RestEndpointMethods } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types';

export default class Issue extends GenericEvent {
    eventType: EventTypes = "issue";
  
    static async init(context: Context, rest: RestEndpointMethods) {
      if (!context.payload.pull_request) {
        throw new Error('No pull_request payload');
      }
  
      const { owner, repo } = context.repo;
  
      const { data: pullRequest } = await rest.pulls.get({
        owner,
        repo,
        pull_number: context.payload.pull_request.number,
      });
  
      return new Issue(context, rest, pullRequest);
    }

    close(){
        return true;
    }
  }