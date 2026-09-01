import {createSection} from '@/components/section/Section';
import {createTextField} from '@/components/field/TextField';
import {createButton} from '@/components/button/Button';
import type {CategoryForm} from './types';
import fieldStyles from '@/components/field/field.module.scss';

const describeGeolocationError = (error: GeolocationPositionError): string => {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      return 'Доступ к геолокации запрещён — разрешите его в настройках браузера/сайта.';
    case error.POSITION_UNAVAILABLE:
      return 'Не удалось определить местоположение. Попробуйте ещё раз.';
    case error.TIMEOUT:
      return 'Определение местоположения заняло слишком много времени. Попробуйте ещё раз.';
    default:
      return 'Не удалось определить местоположение.';
  }
};

export const geoForm: CategoryForm = {
  mount(container, store) {
    container.innerHTML = '';
    const {root, body} = createSection({title: 'Геолокация'});
    const state = store.get().geo;

    const latField = createTextField({
      label: 'Широта',
      placeholder: '55.751244',
      value: state.lat,
      onInput: (value) => store.update((draft) => {
        draft.geo.lat = value;
      })
    });

    const lngField = createTextField({
      label: 'Долгота',
      placeholder: '37.618423',
      value: state.lng,
      onInput: (value) => store.update((draft) => {
        draft.geo.lng = value;
      })
    });

    const statusHint = document.createElement('div');
    statusHint.className = fieldStyles.hint;
    statusHint.style.display = 'none';

    const setStatus = (text: string, isError: boolean) => {
      statusHint.textContent = text;
      statusHint.style.display = text ? '' : 'none';
      statusHint.classList.toggle(fieldStyles.hintError, isError);
    };

    const locateButton = createButton({
      variant: 'secondary',
      label: 'Определить моё местоположение',
      onClick: () => {
        // Geolocation requires a secure context (HTTPS or localhost). On a
        // plain-HTTP LAN address (typical for `bun run dev` opened from
        // another device) `navigator.geolocation` is either missing or
        // immediately fails — previously this just did nothing visibly.
        if(!window.isSecureContext) {
          setStatus('Геолокация работает только по HTTPS или на localhost.', true);
          return;
        }
        if(!navigator.geolocation) {
          setStatus('Браузер не поддерживает геолокацию.', true);
          return;
        }

        setStatus('Определяем местоположение…', false);
        locateButton.disabled = true;

        navigator.geolocation.getCurrentPosition(
          (position) => {
            locateButton.disabled = false;
            const lat = position.coords.latitude.toFixed(6);
            const lng = position.coords.longitude.toFixed(6);
            latField.setValue(lat);
            lngField.setValue(lng);
            store.update((draft) => {
              draft.geo.lat = lat;
              draft.geo.lng = lng;
            });
            setStatus('Местоположение определено.', false);
          },
          (error) => {
            locateButton.disabled = false;
            setStatus(describeGeolocationError(error), true);
          },
          {enableHighAccuracy: false, timeout: 10000, maximumAge: 60000}
        );
      }
    });

    body.append(latField.root, lngField.root, locateButton, statusHint);
    container.appendChild(root);
  }
};
