export type Label = {
  name: string;
  color: string;
  description: string;
  regex?: RegExp;
};

export const labels: Record<string, Label> = {
  wip: {
    regex: /^\[WIP\]\s/i,
    name: ':construction: WIP',
    color: '#FBCA04',
    description: 'Still under development, not yet ready for review',
  },
  readyForReview: {
    name: ':mag: Ready for Review',
    color: '#334796',
    description: 'Ready for reviews',
  },
  approved: {
    name: ':white_check_mark: Approved',
    color: '#0E8A16',
    description: 'Has been reviewed, approved and is ready for merge',
  },
  changesRequested: {
    name: ':warning: Changes requested',
    color: '#AA2626',
    description: 'Has been reviewd, and changes have been requested',
  },
  merged: {
    name: ':sparkles: Merged',
    color: '#6F42C1',
    description: 'Merged successfully',
  },
  failingCI: {
    name: ':x: Failing CI',
    color: '#F92F60',
    description:
      'There are failing tests that must be fixed before it can be reviewed',
  },
};
