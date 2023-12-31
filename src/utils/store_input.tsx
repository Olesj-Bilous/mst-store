import { Checkbox, Input, Select, Form, List } from "antd";
import { observer } from "mobx-react-lite";
import { values } from "mobx";
import { getType, isStateTreeNode, getPropertyMembers } from "mobx-state-tree";

import { useStoreContext } from "./useStoreContext";
import { ContextStore } from "stores/root_store";

export const StoreInput = observer((props: { provider: any, root: any, propName: string, selector?: any }) => {
  const context = useStoreContext();
  const prop = props.selector(context as any)[props.propName];

  const validationMsgs = props.selector(context as any).validate(props.propName);
  const hm = getPropertyMembers(props.selector(context)).properties[props.propName].name.includes('reference');

  let input;
  if (props.propName === 'id') {
    input = <span>{prop}</span>
  } else {
    switch (typeof prop) {
      case 'boolean': input = <Checkbox checked={prop} onChange={e => props.selector(context as any).setDefault(props.propName, e.target.checked)} />; break;
      default:
        input = hm
          ? <StoreSelect optionsType={props.propName} provider={props.provider} root={props.root} propName={props.propName} selector={props.selector} />
          : <Input value={prop} onChange={e => props.selector(context as any).setDefault(props.propName, e.target.value)} />;
    }
  }

  return (
      <Form.Item required={props.selector(context as any).isRequired(props.propName)} label={props.selector(context as any).getDisplayName(props.propName)}>
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

export const StoreSelect = observer((props: { optionsType: string, provider: any, root: any, propName: string, selector?: any }) => {
  const rootStore = useStoreContext();
  const options = rootStore[props.optionsType + 's'];

  const context = props.selector(rootStore);
  const selected = (context as any)[props.propName]?.id ?? '-1';

  const opts = options.map((opt: any) => ({ value: opt.id, label: opt.displayName}));
  opts.push({value: '-1', label: 'Select a ' + props.propName});

  return (
      <Select value={selected} options={opts} onChange={newValue => (context as any).setDefault(props.propName, newValue)} />
    )
});
