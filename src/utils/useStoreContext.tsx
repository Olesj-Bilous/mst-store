import { useContext } from 'react';

export default function useStoreContext<T>(StoreContext: React.Context<T>) {
    const storeContext = useContext(StoreContext);
    if (storeContext === null) throw new Error("StoreContext cannot be null, please add a StoreContextProvider and pass it a store as value");
    return storeContext;
  }
