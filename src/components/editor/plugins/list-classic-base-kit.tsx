import {
  BaseBulletedListPlugin,
  BaseListItemContentPlugin,
  BaseListItemPlugin,
  BaseListPlugin,
  BaseNumberedListPlugin,
  BaseTaskListPlugin,
} from '@platejs/list-classic';

export const BaseListKit = [
  BaseListPlugin.configure({}),
  BaseListItemPlugin,
  BaseListItemContentPlugin,
  BaseBulletedListPlugin.configure({}),
  BaseNumberedListPlugin.configure({}),
  BaseTaskListPlugin.configure({}),
];
