import React from 'react';
import classnames from 'classnames';
import styles from './index.less';

interface IButtonProps {
  bgc?: string;
  color?: string;
  bc?: string;
  primary?: boolean;
  text: string;
  prefix?: string;
  suffix?: string;
  onClick?: any;
}

const Button = (props: IButtonProps) => {
  const {
    prefix,
    primary = false,
    // color = '#373737',
    // bgc = '#ffffff',
    // bc = '#d8d8d8',
    text,
    onClick,
    suffix,
  } = props;

  return (
    <div
      onClick={onClick}
      className={classnames(styles.wrap, {
        [styles.primary]: primary,
      })}
      // style={{ color, backgroundColor: bgc, borderColor: bc }}
    >
      <span
        className={classnames(styles.text, {
          [styles.prefix]: prefix,
          [styles.padding]: suffix,
        })}
      >
        {prefix ? <i className={classnames('iconfont', prefix)} /> : null}
        {text}
      </span>
      {suffix ? (
        <span className={styles.suffix}>
          <i className={classnames('iconfont', suffix)} />
        </span>
      ) : null}
    </div>
  );
};

export default Button;
