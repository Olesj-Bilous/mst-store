import { Card, Form } from "antd";
import { observer } from "mobx-react-lite";

import useStoreContext from 'utils/useStoreContext'
import { StoreInput } from "./store_input";

export const StoreConsumer = observer(<TStore, TContext, TRoot>(props: {
  storeContext: React.Context<null|TStore>,
  targetContext: React.Context<null|TContext>,
  rootContext: React.Context<null|TRoot>,
  contextDeriver: (store: TStore) => TContext,
  provided?: boolean
  }) => {
  const storeContext = useStoreContext(props.storeContext);
  const context = props.contextDeriver(storeContext);

  const inputs = [];
  for (let propName in context) {
      inputs.push(<div>{<StoreInput provider={props.targetContext} propName={propName} root={props.rootContext} />}</div>)
  }

  const displayName = (context as any).modelDisplayName;
  const content = (<Form>{inputs}</Form>)

  return <Card title={displayName} >
    {
      context != null && (context as any).id !== '-1'
        ? (props.provided ? content : <props.targetContext.Provider value={context}>{content}</props.targetContext.Provider>) 
        : <>No {displayName} yet.</> 
    }
  </Card>;
});
