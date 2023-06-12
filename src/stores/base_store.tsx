import { types, isStateTreeNode, getPath } from 'mobx-state-tree';
import { values, isObservableMap } from 'mobx';

export const BaseStore = types.model('BaseStore').views(self => ({
  get hasTouched() {
    if ((self as any).id === '-1') return false;
    for (let propName in self) {
      if (propName === 'id') continue;
      if (getPath(self) === '' && ['fresh', 'annotations'].includes(propName)) continue;
      let prop = (self as any)[propName];
      if (isObservableMap(prop)) {
        for (let mapping of values(prop)) {
          if (mapping.id === '-1') continue;
          const touched = (mapping as any).hasTouched;
          if (touched) return true;
        }
        continue;
      }
      if (getPath(self) === '' && isStateTreeNode(prop)) continue;  // do not switch order on checks, isStateTreeNode evaluates to true for types.map :)
      const touched = (self as any).isTouched(propName);
      if (touched) return true;
    }
    return false;
  },
  get isValid() {
    if ((self as any).id === '-1') return true;
    for (let propName in self) {
      if (propName === 'id') continue;
      if (getPath(self) === '' && ['fresh', 'annotations'].includes(propName)) continue;
      let prop = (self as any)[propName];
      if (isObservableMap(prop)) {
        for (let mapping of values(prop)) {
          if (mapping.id === '-1') continue;
          const notValid = !(mapping as any).isValid
          if (notValid) return false;
        }
        continue;
      }
      if (getPath(self) === '' && isStateTreeNode(prop)) continue; // do not switch order on checks, isStateTreeNode evaluates to true for types.map :)
      const notValid = (self as any).validate(propName).length; 
      if (notValid) return false;
    }
    return true;
  }}));
  