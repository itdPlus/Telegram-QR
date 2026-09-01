import '@/style/global.scss';
import {createApp} from '@/app/App';

const container = document.getElementById('app');
if(container) {
  container.appendChild(createApp());
}
