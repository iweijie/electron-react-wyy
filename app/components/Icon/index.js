import React, { PureComponent } from 'react';
import { isString } from 'lodash';
import styles from './index.global.less';

const mini = (props) => {
	return (
		<svg
			viewBox="0 0 1024 1024"
			focusable="false"
			data-icon="step-forward"
			width="1em"
			height="1em"
			fill="currentColor"
			aria-hidden="true"
		>
			<path d="M279.272727 744.727273h93.090909V651.636364H279.272727v93.090909z m93.090909-93.090909h93.090909V558.545455H372.363636v93.090909z m93.090909-93.090909h93.09091V465.454545H465.454545v93.09091z m186.181819-186.181819H558.545455v93.090909h93.090909V372.363636z m93.090909-93.090909H651.636364v93.090909h93.090909V279.272727zM0 558.545455v465.454545h465.454545L279.272727 837.818182V744.727273H186.181818L0 558.545455z m0-558.545455v372.363636h93.090909V93.090909h1024v837.818182H651.636364v93.090909h558.545454V0H0z" />
		</svg>
	);
};

const close = () => {
	return (
		<svg
			viewBox="0 0 1024 1024"
			focusable="false"
			data-icon="step-forward"
			width="1em"
			height="1em"
			fill="currentColor"
			aria-hidden="true"
		>
			<path d="M512 456.310154L94.247385 38.557538a39.542154 39.542154 0 0 0-55.689847 0 39.266462 39.266462 0 0 0 0 55.689847L456.310154 512 38.557538 929.752615a39.542154 39.542154 0 0 0 0 55.689847 39.266462 39.266462 0 0 0 55.689847 0L512 567.689846l417.752615 417.752616c15.163077 15.163077 40.290462 15.36 55.689847 0a39.266462 39.266462 0 0 0 0-55.689847L567.689846 512 985.442462 94.247385a39.542154 39.542154 0 0 0 0-55.689847 39.266462 39.266462 0 0 0-55.689847 0L512 456.310154z" />
		</svg>
	);
};
const heng = () => {
	return (
		<svg
			viewBox="0 0 1024 1024"
			focusable="false"
			data-icon="step-forward"
			width="1em"
			height="1em"
			fill="currentColor"
			aria-hidden="true"
		>
			<path d="M38.482 566.476l945 0 0-117-945 0L38.482 566.476z" />
		</svg>
	);
};

const mouth = () => {
	return (
		<svg
			viewBox="0 0 1024 1024"
			focusable="false"
			data-icon="step-forward"
			width="1em"
			height="1em"
			fill="currentColor"
			aria-hidden="true"
		>
			<path d="M196.923077 78.769231a118.153846 118.153846 0 0 0-118.153846 118.153846v630.153846a118.153846 118.153846 0 0 0 118.153846 118.153846h630.153846a118.153846 118.153846 0 0 0 118.153846-118.153846V196.923077a118.153846 118.153846 0 0 0-118.153846-118.153846H196.923077z m0-78.769231h630.153846a196.923077 196.923077 0 0 1 196.923077 196.923077v630.153846a196.923077 196.923077 0 0 1-196.923077 196.923077H196.923077a196.923077 196.923077 0 0 1-196.923077-196.923077V196.923077a196.923077 196.923077 0 0 1 196.923077-196.923077z" />
		</svg>
	);
};
const typeMap = {
	mini: mini,
	close: close,
	heng: heng,
	mouth: mouth
};

export default class Icon extends PureComponent {
	render() {
		const { type, ...props } = this.props;
		if (isString(type) && typeMap[type]) {
			return <i {...props}>{typeMap[type]()}</i>;
		}
		return <i {...props} />;
	}
}
