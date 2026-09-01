import {createSection} from '@/components/section/Section';
import {createTextField} from '@/components/field/TextField';
import type {CategoryForm} from './types';

export const linkForm: CategoryForm = {
  mount(container, store) {
    container.innerHTML = '';
    const {root, body} = createSection({title: 'Ссылка'});

    const {root: fieldRoot} = createTextField({
      label: 'URL-адрес',
      placeholder: 'example.com или https://example.com',
      value: store.get().link.url,
      onInput: (value) => store.update((draft) => {
        draft.link.url = value;
      })
    });

    body.appendChild(fieldRoot);
    container.appendChild(root);
  }
};
