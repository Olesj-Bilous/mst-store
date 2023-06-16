import { createContext } from "react";
import { types, Instance } from "mobx-state-tree";

import { RootStore } from "stores/root_store";
import { ModelStore } from "stores/model_store";

export const Enterprise = ModelStore.named('Enterprise').props({
  name: types.string
})

export const Store = RootStore.named('Store').props({
  enterprise: types.reference(Enterprise),
  enterprises: types.array(Enterprise)
})

export type StoreInstance = Instance<typeof Store>;

export const StoreContext = createContext<null|StoreInstance>(null);

export const storeInstance = Store.create({
  id: '0',
  enterprise: '0',
  enterprises: [{id:'0',name:'Landsraad'}],
  annotations: {enterprise:{name:{required:true}}}
});
