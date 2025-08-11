import { EventEmitter } from './components/base/events';
import { WebLarekAPI } from './components/WebLarekApi';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';

const api = new WebLarekAPI(CDN_URL, API_URL);
const events = new EventEmitter();
