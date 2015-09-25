import React from 'react'

import Navigation from '../components/Navigation.js'
import Footer from '../components/Footer.js'

export default class About extends React.Component {
  render () {
    return (
      <div>
        <Navigation />
        <div className='container-fluid content'>
          <div className='row'>
            <p>`about` content is pending</p>
          </div>
          <Footer />
        </div>

      </div>
    )
  }
}
