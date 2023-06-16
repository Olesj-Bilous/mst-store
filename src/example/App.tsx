import { Card } from 'antd';
import './App.css';
import { StoreContextProvider } from 'utils/useStoreContext';
import { StoreContext, storeInstance } from './stores/enterprise';
import { StoreConsumer } from 'utils/store_consumer';

const App = () => {
  return (
    <StoreContextProvider context={StoreContext} value={storeInstance}>
      <StoreConsumer contextDeriver={(context : any) => context.enterprise} />
    </StoreContextProvider>
  );
};

export default App;
