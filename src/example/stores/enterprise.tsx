import { createContext } from "react";
import { types, Instance } from "mobx-state-tree";

import { RootStore } from "stores/root_store";
import { ModelStore } from "stores/model_store";

export const Address = ModelStore.named('address').props({
  street: types.string
})

export const Enterprise = ModelStore.named('enterprise').props({
  name: types.string,
  address: types.maybeNull(types.reference(Address))
})

export const Store = RootStore.named('store').props({
  enterprise: types.reference(Enterprise),
  enterprises: types.array(Enterprise),
  addresss: types.array(Address)
})

export type StoreInstance = Instance<typeof Store>;

export const StoreContext = createContext<null|StoreInstance>(null);

export const storeInstance = Store.create({
  id: '0',
  enterprise: '0',
  addresss: [{id:'0',street:'A. Boulevard'}],
  enterprises: [{id:'0',name:'Landsraad',address:'0'}],
  annotations: {enterprise:{name:{required:true},address:{required:true}}}
});
