/**
 * time: 2019-12-18 24:00
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types';
import classNames from 'classnames'
import Icon from '../Icon/index'

import styles from './index.less'

class SongSheets extends Component {
    static propTypes = {
		value: PropTypes.string
    };

    static defaultProps = {
		value: ''
    };
    
    constructor(props) {
        super(props)
        this.state = {
            menulistShow: false
        }
    }

    handleSelectorClick = () => {
        this.setState({ menulistShow: !this.state.menulistShow })
    }

    render() {
        // console.log(this.props, 'props')
        const { value } = this.props;
        const { menulistShow } = this.state;
        return (
            <div className={styles.selector}>
                <div onClick={this.handleSelectorClick}>
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
            </div>
        )
    }
}

export default SongSheets;
