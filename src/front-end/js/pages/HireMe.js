import React from 'react'

import Navigation from '../components/Navigation.js'
import Footer from '../components/Footer.js'

export default class HireMe extends React.Component {
  render () {
    return (
      <div>
        <Navigation />
        <div className='container-fluid page-content'>
          <div className='row'>
            <p>`Hire Me` content pending</p>
          </div>
          <Footer />
        </div>
      </div>
    )
  }
}
