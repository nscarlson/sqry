// @flow

import React, { Fragment, Component } from 'react'
import type { Location } from 'react-router'


type Props = {
  location: Location,

}

class Default extends Component<Props> {
  componentDidMount() {
    window.addEventListener('keydown', this.kbShortcut)
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      const canScroll =
        this._scrollContainer &&
        this._scrollContainer._scrollbar &&
        this._scrollContainer._scrollbar.scrollTo
      if (canScroll) {
        // $FlowFixMe already checked this._scrollContainer
        this._scrollContainer._scrollbar.scrollTo(0, 0)
      }
    }
  }

  _scrollContainer = null

  render() {
    return (
        <Fragment>
            <div tabIndex={-1}>
              <div />
            </div>
        </Fragment>
    )
  }
}

export default Default