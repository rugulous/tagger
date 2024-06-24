import * as core from '@actions/core';
import * as github from '@actions/github';

import Entity from './classes/Entity';
import {handler} from "./handlers";

export async function run() {
  try {
    const token = core.getInput('github-token');
    const context = github.context;
    const { rest } = github.getOctokit(token);

    const e = new Entity(context, rest);
    const te = await e.getEventEntity();

    await handler.dispatch(te);

    
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
