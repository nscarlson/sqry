// @flow

import React from 'react'
import { ThemeProvider } from 'styled-components'
import { hot } from 'react-hot-loader'

import theme from 'styles/theme'

import Default from 'components/layout/Default'

const App = () => (
    <ThemeProvider theme={theme}>
        <Default />
    </ThemeProvider>
)

export default hot(module)(App)
