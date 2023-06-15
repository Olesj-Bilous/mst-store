import { Instance, types, getSnapshot, applySnapshot } from 'mobx-state-tree';

import { ModelStore, ModelStoreInstance } from './model_store';
import { Annotation, FieldAnnotation, NumberAnnotation, StringAnnotation } from 'utils/validation';

export const RootStore = ModelStore.named('RootStore').props({
  fresh: types.optional(types.boolean, true),
  annotations: types.frozen<{[key : string] : { [key : string] : Annotation | FieldAnnotation | StringAnnotation | NumberAnnotation }}>()
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

export type RootStoreInstance = Instance<typeof RootStore>;
