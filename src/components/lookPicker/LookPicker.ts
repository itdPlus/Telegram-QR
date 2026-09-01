import {createSection} from '@/components/section/Section';
import {createRadioTiles} from '@/components/radioTiles/RadioTiles';
import {createColorSwatches} from '@/components/colorSwatches/ColorSwatches';
import {createTextField} from '@/components/field/TextField';
import {createButton} from '@/components/button/Button';
import {readImageFileAsDataUrl} from '@/lib/file';
import type {Store} from '@/core/store';
import type {AppState, LogoMode, LookType} from '@/core/types';
import fieldStyles from '@/components/field/field.module.scss';
import styles from './lookPicker.module.scss';

const MAX_LOGO_FILE_SIZE = 3 * 1024 * 1024;
const ACCEPTED_LOGO_TYPES = new Set(['image/svg+xml', 'image/png']);

const isAcceptedLogoFile = (file: File): boolean => {
  if(ACCEPTED_LOGO_TYPES.has(file.type)) return true;
  const extension = file.name.split('.').pop()?.toLowerCase();
  return extension === 'svg' || extension === 'png';
};

export function createLookPicker(store: Store<AppState>): HTMLElement {
  const {root, body} = createSection({title: 'Внешний вид'});
  const state = store.get().look;

  const radioTiles = createRadioTiles<LookType>({
    value: state.type,
    options: [
      {value: 'plain', label: 'Только код', previewModifier: 'plain'},
      {value: 'framed', label: 'С рамкой', previewModifier: 'framed'},
      {value: 'background', label: 'С фоном', previewModifier: 'background'}
    ],
    onChange: (value) => {
      store.update((draft) => {
        draft.look.type = value;
      });
      updateLabelVisibility();
    }
  });

  const colorLabel = document.createElement('div');
  colorLabel.className = fieldStyles.label;
  colorLabel.textContent = 'Цвет кода';

  const colorSwatches = createColorSwatches({
    value: state.colorPreset,
    customColor: state.type === 'background' ? state.customBackground : state.customForeground,
    onSelect: (preset) => store.update((draft) => {
      draft.look.colorPreset = preset;
    }),
    onCustomColor: (hex) => store.update((draft) => {
      if(draft.look.type === 'background') draft.look.customBackground = hex;
      else draft.look.customForeground = hex;
    })
  });

  const labelField = createTextField({
    label: 'Текст подписи',
    placeholder: 'Например, «Сканируйте камерой»',
    value: state.label,
    maxLength: 30,
    onInput: (value) => store.update((draft) => {
      draft.look.label = value;
    })
  });

  const updateLabelVisibility = () => {
    labelField.root.style.display = store.get().look.type === 'plain' ? 'none' : '';
  };
  updateLabelVisibility();

  const logoLabel = document.createElement('div');
  logoLabel.className = fieldStyles.label;
  logoLabel.textContent = 'Логотип в центре кода';

  const logoTiles = createRadioTiles<LogoMode>({
    value: state.logoMode,
    options: [
      {value: 'telegram', label: 'Telegram'},
      {value: 'none', label: 'Без логотипа'},
      {value: 'custom', label: 'Своё изображение'}
    ],
    onChange: (value) => {
      store.update((draft) => {
        draft.look.logoMode = value;
      });
      updateLogoUploadVisibility();
    }
  });

  const logoUploadRow = document.createElement('div');
  logoUploadRow.className = styles.logoRow;

  const logoPreview = document.createElement('div');
  logoPreview.className = styles.logoPreview;

  const renderLogoPreview = (dataUrl: string) => {
    logoPreview.innerHTML = '';
    if(!dataUrl) return;
    const img = document.createElement('img');
    img.src = dataUrl;
    logoPreview.appendChild(img);
  };
  renderLogoPreview(state.customLogoDataUrl);

  const logoInfo = document.createElement('div');
  logoInfo.className = styles.logoInfo;

  const logoFileName = document.createElement('div');
  logoFileName.className = styles.logoFileName;
  logoFileName.textContent = state.customLogoName || 'Файл не выбран';

  const logoError = document.createElement('div');
  logoError.className = styles.logoError;
  logoError.style.display = 'none';

  const logoButtons = document.createElement('div');
  logoButtons.className = styles.logoButtons;

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.svg,.png,image/svg+xml,image/png';
  fileInput.style.display = 'none';

  const setLogoError = (message: string) => {
    logoError.textContent = message;
    logoError.style.display = message ? '' : 'none';
  };

  fileInput.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    fileInput.value = '';
    if(!file) return;

    if(!isAcceptedLogoFile(file)) {
      setLogoError('Поддерживаются только файлы SVG и PNG');
      return;
    }
    if(file.size > MAX_LOGO_FILE_SIZE) {
      setLogoError('Файл слишком большой (максимум 3 МБ)');
      return;
    }

    setLogoError('');
    readImageFileAsDataUrl(file).then((dataUrl) => {
      renderLogoPreview(dataUrl);
      logoFileName.textContent = file.name;
      clearButton.style.display = '';
      store.update((draft) => {
        draft.look.customLogoDataUrl = dataUrl;
        draft.look.customLogoName = file.name;
      });
    });
  });

  const uploadButton = createButton({
    variant: 'secondary',
    label: 'Загрузить файл',
    onClick: () => fileInput.click()
  });

  const clearButton = createButton({
    variant: 'plain',
    label: 'Удалить',
    icon: 'close',
    onClick: () => {
      renderLogoPreview('');
      logoFileName.textContent = 'Файл не выбран';
      setLogoError('');
      clearButton.style.display = 'none';
      store.update((draft) => {
        draft.look.customLogoDataUrl = '';
        draft.look.customLogoName = '';
      });
    }
  });
  clearButton.style.display = state.customLogoDataUrl ? '' : 'none';

  logoButtons.append(uploadButton, clearButton);
  logoInfo.append(logoFileName, logoButtons, logoError);
  logoUploadRow.append(logoPreview, logoInfo, fileInput);

  const updateLogoUploadVisibility = () => {
    logoUploadRow.style.display = store.get().look.logoMode === 'custom' ? '' : 'none';
  };
  updateLogoUploadVisibility();

  body.append(radioTiles.root, colorLabel, colorSwatches.root, labelField.root, logoLabel, logoTiles.root, logoUploadRow);
  return root;
}
