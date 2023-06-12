import { IAnyStateTreeNode, isValidReference } from 'mobx-state-tree'

const minLengthString = (min : number, prop : string) => min <= prop.length;
const maxLengthString = (max : number, prop : string) => prop.length <= max;

const isEmailAddress = (_justDoIt: boolean, prop: string) => prop.match('^[\\w-\\.]+@[\\w-]+\\.+[\\w-]{2,4}$');
const isUrl = (_justDoIt: boolean, prop: string) => prop.match('[(http(s)?):\\/\\/(www\\.)?a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)');

const minValueNumber = (min: number, prop: number) => min <= prop;
const maxValueNumber = (max: number, prop: number) => prop <= max;

const minLengthNumber = (min: number, prop: number) => (10**(min - 1)) <= prop;
const maxLengthNumber = (min: number, prop: number) => prop <= (10**min);

const requiredReference = (_justDoIt: boolean, nodeGetter: IAnyStateTreeNode) => nodeGetter.id !== '-1' && isValidReference(() => nodeGetter);

export const validators = {
  string : {
    required : minLengthString,
    minLength : minLengthString,
    maxLength : maxLengthString,
    isEmailAddress: isEmailAddress,
    isUrl: isUrl
  },
  number : {
    required : minLengthNumber,
    minLength : minLengthNumber,
    maxLength : maxLengthNumber,
    minValue : minValueNumber,
    maxValue : maxValueNumber
  },
  reference : {
    required : requiredReference
  }
};

export const validationMsgs = {
  string : {
    required : "This field is required",
    minLength : "This field should be at least $0 characters.",
    maxLength : "This field should not exceed $0 characters.",
    isEmailAddress: 'Please provide a valid email address.',
    isUrl: 'Please provide a valid website url.'
  },
  number: {
    required : "This field is required",
    minLength : "This field should be at least $0 characters.",
    maxLength : "This field should not exceed $0 characters."
  },
  reference : {
    required : "You must select an option of type $0."
  }
}

export const camelToDisplayCase = ( camelString : string) => {
  const parts = camelString.match('^([a-z]+)([A-Z][a-z]*)*$');
  if (parts == null) return '';
  let display = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
  if (2 < parts.length && parts[2] != null) display += ' ' + parts.slice(2).join(' ');
  return display;
}
