import {createSection} from '@/components/section/Section';
import {createTextField} from '@/components/field/TextField';
import type {CategoryForm} from './types';

export const textForm: CategoryForm = {
  mount(container, store) {
    container.innerHTML = '';
    const {root, body} = createSection({title: 'Текст'});

    const {root: fieldRoot} = createTextField({
      label: 'Содержимое',
      placeholder: 'Любой текст, который окажется в QR-коде',
      value: store.get().text.text,
      textarea: true,
      onInput: (value) => store.update((draft) => {
        draft.text.text = value;
      })
    });

    body.appendChild(fieldRoot);
    container.appendChild(root);
  }
};
