import { isObservableMap } from 'mobx';
import { cast, getType, getRoot, getPathParts, isStateTreeNode } from 'mobx-state-tree';

import { BaseStore } from './base_store';
import { validators, validationMsgs, camelToDisplayCase } from 'utils/validation';

export const ModelStore = BaseStore.named('ModelStore').actions(self => ({
    setDefault<K extends keyof typeof self, T extends typeof self>(key: K, value: T[K]) {
      if (key as any === 'id') return;
      if (typeof self[key] === 'number') {
        const num = Number(value);
        if (!isNaN(num)) self[key] = num as any;
        return;
      }
      self[key] = cast(value);
    }
  })).views(self => {
    return {
      get modelDisplayName() {
        return camelToDisplayCase(getType(self).name);
      },
      getDisplayName<K extends keyof typeof self>(key: K) {
        const storeType = getType(self).name;
        const notes = ((getRoot(self) as any).annotations as any)[storeType];
        let name = (notes as any)?.displayName;
        if (name == null || typeof name !== 'string' || name.replace(' ', '') === '') {
          const keyString = key.toString();
          name = camelToDisplayCase(keyString)
          if (name === '') return keyString;
        }
        return name;
      },
      isTouched(key:string) {
        if (key === 'id') return false;
        let root = getRoot(self);
        const item = localStorage.getItem('StoreCheckpoint');
        if (item == null) {
          (root as any).save();
          return false;
        }
        const snapshot = cast(JSON.parse(item));
        const path = getPathParts(self);
        let original = snapshot;
        path.forEach(function(part) {
          original = original[part]});
        const target = (self as any)[key];
        return (root as any).fresh && original[key] !== (isStateTreeNode(target) ? (target as any).id : target);
      },
      validate<K extends keyof typeof self>(key: K) {
        const storeType = getType(self).name;
        const notes = ((getRoot(self) as any).annotations as any)[storeType];
        if (!notes) return [];
        const annotation = (notes as any)[key];
        if (isObservableMap(self[key])) return true;
        const type = isStateTreeNode(self[key]) ? 'reference' : typeof self[key];
        const validate = (validators as any)[type];
        const msgs = [];
        for (let note in annotation) {
          if (!validate[note].apply(null, [annotation[note], self[key]]))
            msgs.push((validationMsgs as any)[type][note].replace('$0', type === 'reference' ? getType(self[key]).name : annotation[note]));
        }
        return msgs;
      },
      isRequired<K extends keyof typeof self>(key: K) {
        const storeType = getType(self).name;
        const notes = ((getRoot(self) as any).annotations as any)[storeType];
        const checkNote = notes && notes[key];
        return checkNote && checkNote['required'];
      }
  }});

export type ModelStoreInstance = {};
