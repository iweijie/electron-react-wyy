import native from './native';
import winEvent from './winEvent';
// import request from './request';
export default (win) => {
	native(win);
	winEvent(win);
	// request(win);
	// setCookies(win);
};