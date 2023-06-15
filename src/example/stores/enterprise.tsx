import { types } from "mobx-state-tree";

import { RootStore } from "stores/root_store";
import { ModelStore } from "stores/model_store";

export const Enterprise = ModelStore.named('Enterprise').props({

})

export const Store = RootStore.named('Store').props({
  enterprise: types.reference(Enterprise)
})
