import { EventEmitter } from './components/base/events';
import { LarekAPI } from './components/LarekApi';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';

const api = new LarekAPI(CDN_URL, API_URL);
const events = new EventEmitter();
