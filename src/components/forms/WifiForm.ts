import {createSection} from '@/components/section/Section';
import {createTextField} from '@/components/field/TextField';
import {createSelectField} from '@/components/field/SelectField';
import {createCheckboxField} from '@/components/field/CheckboxField';
import type {WifiSecurity} from '@/core/types';
import type {CategoryForm} from './types';

export const wifiForm: CategoryForm = {
  mount(container, store) {
    container.innerHTML = '';
    const {root, body} = createSection({title: 'Wi-Fi'});
    const state = store.get().wifi;

    const {root: ssidRoot} = createTextField({
      label: 'Название сети (SSID)',
      placeholder: 'MyWiFi',
      value: state.ssid,
      onInput: (value) => store.update((draft) => {
        draft.wifi.ssid = value;
      })
    });

    const {root: passwordRoot} = createTextField({
      label: 'Пароль',
      placeholder: 'Оставьте пустым для открытой сети',
      value: state.password,
      onInput: (value) => store.update((draft) => {
        draft.wifi.password = value;
      })
    });

    const securityRoot = createSelectField({
      label: 'Тип защиты',
      value: state.security,
      options: [
        {value: 'WPA', label: 'WPA/WPA2'},
        {value: 'WEP', label: 'WEP'},
        {value: 'nopass', label: 'Без пароля'}
      ],
      onChange: (value) => store.update((draft) => {
        draft.wifi.security = value as WifiSecurity;
      })
    });

    const hiddenCheckbox = createCheckboxField({
      label: 'Скрытая сеть',
      checked: state.hidden,
      onChange: (checked) => store.update((draft) => {
        draft.wifi.hidden = checked;
      })
    });

    body.append(ssidRoot, securityRoot, passwordRoot, hiddenCheckbox);
    container.appendChild(root);
  }
};
