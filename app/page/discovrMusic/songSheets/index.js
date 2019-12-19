import React, { Component } from 'react'
import Select from 'components/Select/index'

import styles from './index.less'

class SongSheets extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        console.log(this.props, 'props')
        return (
            <div className={styles.songSheets}>
                <div className={styles.songSortsSelect}>
                    <Select value='欧美'>test</Select>
                </div>
            </div>
        )
    }
}

export default SongSheets;
