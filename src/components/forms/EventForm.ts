import {createSection} from '@/components/section/Section';
import {createTextField} from '@/components/field/TextField';
import type {CategoryForm} from './types';
import styles from './eventForm.module.scss';

export const eventForm: CategoryForm = {
  mount(container, store) {
    container.innerHTML = '';
    const {root, body} = createSection({title: 'Событие'});
    const state = store.get().event;

    const {root: titleRoot} = createTextField({
      label: 'Название',
      placeholder: 'День рождения',
      value: state.title,
      onInput: (value) => store.update((draft) => {
        draft.event.title = value;
      })
    });

    const {root: descriptionRoot} = createTextField({
      label: 'Описание',
      placeholder: 'Необязательно',
      value: state.description,
      textarea: true,
      onInput: (value) => store.update((draft) => {
        draft.event.description = value;
      })
    });

    const dateRow = document.createElement('div');
    dateRow.className = styles.row;

    const {root: startDateRoot} = createTextField({
      label: 'Дата начала',
      value: state.startDate,
      type: 'date',
      onInput: (value) => store.update((draft) => {
        draft.event.startDate = value;
      })
    });

    const {root: startTimeRoot} = createTextField({
      label: 'Время начала',
      value: state.startTime,
      type: 'time',
      onInput: (value) => store.update((draft) => {
        draft.event.startTime = value;
      })
    });

    dateRow.append(startDateRoot, startTimeRoot);

    const endRow = document.createElement('div');
    endRow.className = styles.row;

    const {root: endDateRoot} = createTextField({
      label: 'Дата окончания',
      value: state.endDate,
      type: 'date',
      onInput: (value) => store.update((draft) => {
        draft.event.endDate = value;
      })
    });

    const {root: endTimeRoot} = createTextField({
      label: 'Время окончания',
      value: state.endTime,
      type: 'time',
      onInput: (value) => store.update((draft) => {
        draft.event.endTime = value;
      })
    });

    endRow.append(endDateRoot, endTimeRoot);

    body.append(titleRoot, descriptionRoot, dateRow, endRow);
    container.appendChild(root);
  }
};
