import { Checkbox, Input, Select, Form, List } from "antd";
import { observer } from "mobx-react-lite";
import { values } from "mobx";
import { getType, isStateTreeNode } from "mobx-state-tree";

import useStoreContext from "./useStoreContext";

export const StoreInput = observer((props: { provider: any, root: any, propName: string }) => {
  const context = useStoreContext(props.provider);
  const prop = (context as any)[props.propName];

  const validationMsgs = (context as any).validate(props.propName);

  let input;
  if (props.propName === 'id') {
    input = <span>{prop}</span>
  } else {
    switch (typeof prop) {
      case 'boolean': input = <Checkbox checked={prop} onChange={e => (context as any).setDefault(props.propName, e.target.checked)} />; break;
      default:
        input = isStateTreeNode(prop)
          ? <StoreSelect optionsType={getType(prop).name} provider={props.provider} root={props.root} propName={props.propName} />
          : <Input value={prop} onChange={e => (context as any).setDefault(props.propName, e.target.value)} />;
    }
  }

  return (
      <Form.Item required={(context as any).isRequired(props.propName)} label={(context as any).getDisplayName(props.propName)}>
        {input}
        {validationMsgs.length !== 0 && (
            <List bordered={true} size={'small'}>
              {validationMsgs.map((msg:string, key:number) => (
                <List.Item key={key} style={{color:'red'}}>{msg}</List.Item>
                ))}
            </List>
          )}
      </Form.Item>
    );
});

export const StoreSelect = observer((props: { optionsType: string, provider: any, root: any, propName: string }) => {
  const rootStore = useStoreContext(props.root);
  const options = values((rootStore as any)[props.optionsType + 's']);

  const context = useStoreContext(props.provider);
  const selected = (context as any)[props.propName].id;

  return (
      <Select value={selected} options={
          options.map((opt: any) => ({ value: opt.id, label: opt.displayName}))
        } onChange={newValue => (context as any).setDefault(props.propName, newValue)} />
    )
});
