/**
 * time: 2019-12-18 24:00
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types';
import classNames from 'classnames'
import Icon from '../Icon/index'

import styles from './index.less'

class Select extends Component {
    static propTypes = {
		    value: PropTypes.string
    };

    static defaultProps = {
		    value: ''
    };

    constructor(props) {
        super(props)
        this.state = {

        }
    }

    // componentDidMount() {
    //   document.body.addEventListener('click', e => {
    //       console.log(e)
    //       if (e.target && e.target.matches('#m-btn')) {
    //           return;
    //       }
    //   })
    // }

    render() {
        // console.log(this.props, 'props')
        const { value, menulistShow } = this.props;
        return (
            <div className={styles.selectorWrap}>
                <div className={styles.selector} onClick={this.props.handleSelectorClick}>
                    <span>{value}</span>
                    <Icon type='arrowDown' className={styles.arrowDown} />
                </div>
                <div className={classNames(styles.menuContent, {
                    [styles.menulistShow]: menulistShow
                })}>
                    <div className={styles.addLabel}>添加标签</div>
                    <div className={styles.menulist}>
                        {this.props.children}
                    </div>
                </div>
                <div onClick={this.handleMaskClick} className={styles.mask}></div>
            </div>
        )
    }
}

export default Select;
