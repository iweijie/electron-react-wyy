import { axiosGet } from './axios';
import {songListUrl} from './api'

export function getSongList() {
	return axiosGet(songListUrl, { uid: 376014539 }, function(data) {
		console.log(data);
	});
}
