import {createSection} from '@/components/section/Section';
import {createTextField} from '@/components/field/TextField';
import {createButton} from '@/components/button/Button';
import {WALLPAPER_PRESETS, getWallpaperStops} from '@/lib/wallpapers';
import {readImageFileAsDataUrl} from '@/lib/file';
import type {CategoryForm} from './types';
import styles from './profileForm.module.scss';

export const profileForm: CategoryForm = {
  mount(container, store) {
    container.innerHTML = '';
    const state = store.get().profile;

    const identitySection = createSection({title: 'Профиль'});

    const {root: usernameRoot} = createTextField({
      label: 'Имя пользователя',
      placeholder: '@username',
      value: state.username,
      onInput: (value) => store.update((draft) => {
        draft.profile.username = value;
      })
    });

    const {root: displayNameRoot} = createTextField({
      label: 'Отображаемое имя',
      placeholder: 'Иван Иванов',
      value: state.displayName,
      onInput: (value) => store.update((draft) => {
        draft.profile.displayName = value;
      })
    });

    const avatarRow = document.createElement('div');
    avatarRow.className = styles.avatarRow;

    const avatarPreview = document.createElement('div');
    avatarPreview.className = styles.avatarPreview;
    if(state.avatarDataUrl) avatarPreview.style.backgroundImage = `url(${state.avatarDataUrl})`;

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    fileInput.addEventListener('change', () => {
      const file = fileInput.files?.[0];
      if(!file) return;
      readImageFileAsDataUrl(file).then((dataUrl) => {
        avatarPreview.style.backgroundImage = `url(${dataUrl})`;
        store.update((draft) => {
          draft.profile.avatarDataUrl = dataUrl;
        });
      });
    });

    const avatarButton = createButton({
      variant: 'secondary',
      label: 'Загрузить аватар',
      onClick: () => fileInput.click()
    });

    avatarRow.append(avatarPreview, avatarButton, fileInput);

    identitySection.body.append(usernameRoot, displayNameRoot, avatarRow);

    const appearanceSection = createSection({title: 'Обои карточки'});

    const wallpaperGrid = document.createElement('div');
    wallpaperGrid.className = styles.wallpaperGrid;

    const swatchElements = new Map<string, HTMLButtonElement>();
    const applyActiveWallpaper = (id: string) => {
      for(const [presetId, element] of swatchElements) {
        element.classList.toggle(styles.wallpaperSwatchActive, presetId === id);
      }
    };

    for(const preset of WALLPAPER_PRESETS) {
      const swatch = document.createElement('button');
      swatch.type = 'button';
      swatch.className = styles.wallpaperSwatch;
      swatch.title = preset.name;
      const stops = getWallpaperStops(preset, store.get().profile.nightMode);
      swatch.style.background = `linear-gradient(135deg, ${stops.join(', ')})`;

      swatch.addEventListener('click', () => {
        store.update((draft) => {
          draft.profile.wallpaperId = preset.id;
        });
        applyActiveWallpaper(preset.id);
      });

      swatchElements.set(preset.id, swatch);
      wallpaperGrid.appendChild(swatch);
    }

    applyActiveWallpaper(state.wallpaperId);

    const toggleRow = document.createElement('div');
    toggleRow.className = styles.toggleRow;

    const toggleLabel = document.createElement('span');
    toggleLabel.className = styles.toggleLabel;
    toggleLabel.textContent = 'Ночной режим';

    const switchButton = document.createElement('button');
    switchButton.type = 'button';
    switchButton.className = state.nightMode ? `${styles.switch} ${styles.switchActive}` : styles.switch;
    switchButton.addEventListener('click', () => {
      const next = !store.get().profile.nightMode;
      store.update((draft) => {
        draft.profile.nightMode = next;
      });
      switchButton.classList.toggle(styles.switchActive, next);
      for(const preset of WALLPAPER_PRESETS) {
        const stops = getWallpaperStops(preset, next);
        const swatch = swatchElements.get(preset.id);
        if(swatch) swatch.style.background = `linear-gradient(135deg, ${stops.join(', ')})`;
      }
    });

    toggleRow.append(toggleLabel, switchButton);
    appearanceSection.body.append(wallpaperGrid, toggleRow);

    container.append(identitySection.root, appearanceSection.root);
  }
};
