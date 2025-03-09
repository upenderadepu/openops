import { BlockAuth, createBlock } from '@openops/blocks-framework';
import { BlockCategory } from '@openops/shared';
import { extractFromListAction } from './lib/actions/extract-from-action';
import { groupByAction } from './lib/actions/group-by-action';
import { toMapAction } from './lib/actions/to-dictionary-action';

export const listOperations = createBlock({
  displayName: 'List Operations',
  auth: BlockAuth.None(),
  minimumSupportedRelease: '0.9.0',
  logoUrl:
    'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSIyNHB4IiBzdHJva2Utd2lkdGg9IjIuMyIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgY29sb3I9IiNmZDA4NWQiPjxwYXRoIGQ9Ik05LjAwMDAxIDIxTDguMDAwMDEgMjFDNi44OTU0NCAyMSA2LjAwMDAxIDIwLjEwNTcgNi4wMDAwMSAxOS4wMDExQzYuMDAwMDEgMTcuNDUwMSA2LjAwMDAxIDE1LjM0NDMgNiAxNEM2IDEzIDQuNSAxMiA0LjUgMTJDNC41IDEyIDYuMDAwMDEgMTEgNi4wMDAwMSAxMEM2LjAwMDAxIDguODI3IDYuMDAwMDEgNi42MjIwNyA2LjAwMDAxIDQuOTk5MTRDNi4wMDAwMSAzLjg5NDU3IDYuODk1NDQgMyA4LjAwMDAxIDNMOS4wMDAwMSAzIiBzdHJva2U9IiNmZDA4NWQiIHN0cm9rZS13aWR0aD0iMi4zIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjwvcGF0aD48cGF0aCBkPSJNMTUgMjFMMTYgMjFDMTcuMTA0NiAyMSAxOCAyMC4xMDU3IDE4IDE5LjAwMTFDMTggMTcuNDUwMSAxOCAxNS4zNDQzIDE4IDE0QzE4IDEzIDE5LjUgMTIgMTkuNSAxMkMxOS41IDEyIDE4IDExIDE4IDEwQzE4IDguODI3IDE4IDYuNjIyMDcgMTggNC45OTkxNEMxOCAzLjg5NDU3IDE3LjEwNDYgMyAxNiAzTDE1IDMiIHN0cm9rZT0iI2ZkMDg1ZCIgc3Ryb2tlLXdpZHRoPSIyLjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PC9wYXRoPjwvc3ZnPg==',
  authors: [],
  actions: [groupByAction, extractFromListAction, toMapAction],
  triggers: [],
  categories: [BlockCategory.CORE],
});
