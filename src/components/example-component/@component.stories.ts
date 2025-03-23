import './index';

import { exampleComponentInterface } from './exampleComponent.interfaces';
import notes from './README.md';
import changelog from './CHANGELOG.md';
import packagejson from './package.json';
import { generateDocs } from '../shared/functions';

export default {
  parameters: {
    docs: {
      description: {
        component: generateDocs(notes, changelog, packagejson),
      },
    },
    actions: {
      handles: ['click', 'click .btn'],
    },
  },
  argTypes: {
    props: {
      control: 'text',
      description: 'prop of the example component',
      table: {
        type: { summary: 'string' },
      },
    },
  },
  title: 'Components/example-component',
};

const ExampleComponent = (args: exampleComponentInterface): HTMLElement => {
  const element = document.createElement('example-component');
  if (args.props) {
    element.setAttribute('props', args.props);
  }
  return element;
};

export const Basic = ExampleComponent.bind({});
