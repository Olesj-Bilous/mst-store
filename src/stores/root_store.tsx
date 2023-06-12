import { types, getSnapshot, applySnapshot } from 'mobx-state-tree';

import { BaseStore } from './base_store';

export const RootStore = BaseStore.named('RootStore').props({
  fresh: types.optional(types.boolean, true),
  annotations: types.frozen()
}).actions(self => ({
  save() {
    localStorage.setItem('StoreCheckpoint', JSON.stringify(getSnapshot(self)));
    self.fresh = false;
    self.fresh = true;
  },
  cancel() {
    const checkpoint = localStorage.getItem('StoreCheckpoint');
    if (checkpoint != null)
      applySnapshot(self, JSON.parse(checkpoint));
  }
}));
