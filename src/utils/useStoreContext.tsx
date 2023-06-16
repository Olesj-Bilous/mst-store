import { Instance } from 'mobx-state-tree';
import { createContext, useContext } from 'react';
import { ContextStore, RootStore } from 'stores/root_store';

export function useStoreContext<T>(StoreContext?: React.Context<T>) {
    const ctx = useContext(ContextStore);
    if (ctx === null) throw new Error("StoreContext cannot be null, please add a StoreContextProvider and pass it a store as value");
    const storeContext = useContext(ctx);
    if (storeContext === null) throw new Error("StoreContext cannot be null, please add a StoreContextProvider and pass it a store as value");
    return storeContext;
  }

export function StoreContextProvider<T extends typeof RootStore, C extends Instance<T>>(props: {context: React.Context<null|C>, value: C, children?: JSX.Element}) {
  return <ContextStore.Provider value={props.context}>
      <props.context.Provider value={props.value}>
        {props.children}
      </props.context.Provider>
    </ContextStore.Provider>
}
