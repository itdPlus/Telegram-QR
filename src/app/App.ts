import {Store} from '@/core/store';
import {createInitialState, type AppState, type CategoryId} from '@/core/types';
import {createHeader} from '@/components/header/Header';
import {createTabs} from '@/components/tabs/Tabs';
import {createQrPreview} from '@/components/qrPreview/QrPreview';
import {createLookPicker} from '@/components/lookPicker/LookPicker';
import type {CategoryForm} from '@/components/forms/types';
import {linkForm} from '@/components/forms/LinkForm';
import {wifiForm} from '@/components/forms/WifiForm';
import {textForm} from '@/components/forms/TextForm';
import {eventForm} from '@/components/forms/EventForm';
import {geoForm} from '@/components/forms/GeoForm';
import {profileForm} from '@/components/forms/ProfileForm';
import styles from './app.module.scss';

const FORM_REGISTRY: Record<CategoryId, CategoryForm> = {
  profile: profileForm,
  link: linkForm,
  wifi: wifiForm,
  text: textForm,
  event: eventForm,
  geo: geoForm
};

export function createApp(): HTMLElement {
  const store = new Store<AppState>(createInitialState());
  const root = document.createElement('div');

  root.appendChild(createHeader());

  const tabsBar = document.createElement('div');
  tabsBar.className = styles.tabsBar;
  const tabsRow = document.createElement('div');
  tabsRow.className = styles.tabsRow;
  const tabs = createTabs({
    value: store.get().category,
    onChange: (category) => store.update((draft) => {
      draft.category = category;
    })
  });
  tabsRow.appendChild(tabs.root);
  tabsBar.appendChild(tabsRow);
  root.appendChild(tabsBar);

  const layout = document.createElement('div');
  layout.className = styles.layout;

  const formColumn = document.createElement('div');
  formColumn.className = styles.formColumn;

  const formContainer = document.createElement('div');
  formColumn.appendChild(formContainer);

  let lookPicker: HTMLElement | null = null;

  const previewColumn = document.createElement('div');
  previewColumn.className = styles.previewColumn;
  previewColumn.appendChild(createQrPreview(store));

  layout.append(formColumn, previewColumn);
  root.appendChild(layout);

  let currentCategory: CategoryId | null = null;

  const renderForm = () => {
    const category = store.get().category;
    if(category === currentCategory) return;
    currentCategory = category;

    FORM_REGISTRY[category].mount(formContainer, store);

    if(lookPicker) {
      lookPicker.remove();
      lookPicker = null;
    }

    if(category !== 'profile') {
      lookPicker = createLookPicker(store);
      formColumn.appendChild(lookPicker);
    }

    tabs.setValue(category);
  };

  store.subscribe(renderForm);
  renderForm();

  return root;
}
