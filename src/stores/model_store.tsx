import { values, isObservableMap } from 'mobx';
import { Instance, cast, getType, getRoot, getPath, getPathParts, isStateTreeNode, types, getPropertyMembers } from 'mobx-state-tree';

import { validators, validationMsgs, camelToDisplayCase } from 'utils/validation';
import { RootStore, RootStoreInstance } from './root_store';

export const ModelStore = types.model('ModelStore', {
    id: types.identifier
  }).actions(self => ({
    setDefault<K extends keyof typeof self, T extends typeof self>(key: K, value: T[K]) {
      const idfer = ModelStore.identifierAttribute;
      if (key === 'id') return;
      if (typeof self[key] === 'number') {
        const num = Number(value);
        if (!isNaN(num)) self[key] = num;
        return;
      }
      self[key] = self[key] != null && isStateTreeNode(self[key]) && value === '-1' ? null : cast(value);
    }
  })).views(self => {
    return {
      get modelDisplayName() {
        return camelToDisplayCase(getType(self).name);
      },
      get hasTouched() {
        if (self.id === '-1') return false;
        for (let propName in self) {
          if (propName === 'id') continue;
          const pm = getPropertyMembers(RootStore);
          if (getPath(self) === '' && ['fresh', 'annotations'].includes(propName)) continue;
          let prop = self[propName as keyof typeof self];
          if (isObservableMap(prop)) {
            for (let mapping of values(prop)) {
              if (mapping.id === '-1') continue;
              const touched = (mapping as ModelStoreInstance).hasTouched;
              if (touched) return true;
            }
            continue;
          }
          if (getPath(self) === '' && isStateTreeNode(prop)) continue;  // do not switch order on checks, isStateTreeNode evaluates to true for types.map :)
          const touched = (self as ModelStoreInstance).isTouched(propName as keyof typeof self);
          if (touched) return true;
        }
        return false;
      },
      get isValid() {
        if (self.id === '-1') return true;
        for (let propName in self) {
          if (propName === 'id') continue;
          if (getPath(self) === '' && ['fresh', 'annotations'].includes(propName)) continue;
          let prop = self[propName as keyof typeof self];
          if (isObservableMap(prop)) {
            for (let mapping of values(prop)) {
              if (mapping.id === '-1') continue;
              const notValid = !(mapping as ModelStoreInstance).isValid
              if (notValid) return false;
            }
            continue;
          }
          if (getPath(self) === '' && isStateTreeNode(prop)) continue; // do not switch order on checks, isStateTreeNode evaluates to true for types.map :)
          const notValid = (self as ModelStoreInstance).validate(propName as keyof typeof self).length; 
          if (notValid) return false;
        }
        return true;
      },
      getDisplayName<K extends keyof typeof self>(key : K) : string {
        const storeType = getType(self).name;
        const notes = (getRoot(self) as RootStoreInstance).annotations[storeType];
        let name = ""; // notes[key as string].displayName;
        if (name == null || typeof name !== 'string' || name.replace(' ', '') === '') {
          return camelToDisplayCase(key.toString());
        }
        return name;
      },
      isTouched<K extends keyof typeof self>(key : K) : boolean {
        if (key === 'id') return false;
        const root = getRoot(self) as RootStoreInstance;
        const snapshot = localStorage.getItem('StoreCheckpoint');
        if (snapshot == null) {
          root.save();
          return false;
        }
        let original = cast(JSON.parse(snapshot));
        const target = self[key];
        const path = getPathParts(self);
        path.forEach(part => { original = original[part]});
        return root.fresh && original[key] !== (isStateTreeNode(target) ? (target as ModelStoreInstance).id : target);
      },
      validate<K extends keyof typeof self>(key : K) : string[] {
        const storeType = getType(self).name;
        const notes = (getRoot(self) as RootStoreInstance).annotations[storeType];
        if (!notes) return [];
        const annotation = notes[key as string];
        if (isObservableMap(self[key])) return [];
        const type = getPropertyMembers(self).properties[key as string].name.includes('reference') ? 'reference' : typeof self[key];
        if (type !== 'string' && type !== 'number' && type !== 'reference') return [];
        const validator = validators[type];
        const msgs = [];
        for (let note in annotation) {
          type typee = keyof typeof annotation;
          const annota = note as typee;
          const nota = annotation[annota];
          const validor = validator[note as keyof typeof annotation];
          if (!(validor as any).apply(null, [nota, (self[key] as Parameters<typeof validor>[1])]))
            msgs.push((validationMsgs as any)[type][note].replace('$0', type === 'reference' ? self[key]?.modelDisplayName ?? key : nota));
        }
        return msgs;
      },
      isRequired<K extends keyof typeof self>(key: K) : boolean {
        const storeType = getType(self).name;
        const notes = (getRoot(self) as RootStoreInstance).annotations[storeType];
        const checkNote = notes && notes[key as string];
        return checkNote != null && (checkNote['required'] ?? false);
      }
  }});

export type ModelStoreInstance = Instance<typeof ModelStore>;
