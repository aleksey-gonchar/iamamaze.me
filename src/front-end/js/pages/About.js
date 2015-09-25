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
            <div className='col-xs-12 cold-md-12'>
              <h1>About</h1>
              <p>Hi! My name is Alex Potter and I've always wanted to be a programmer. Since 1998 I cultivated this skill, constantly expanding the horizons of my knowledge and experience. I love to write beautiful, scalable, and simple code. Prefer to take on difficult, complex tasks that require non-trivial visual and architectural solutions.</p>
              <p>I enjoy working in a team, but in solo I feel myself well too. My passion for organizing and ordering information in the mind-maps allows to control large amounts of structural information. And I am easily able to find a common language with the customer and transform words and ideas in logic and relationships.</p>
              <p>I'll be glad cooperation!</p>
            </div>
          </div>
          <Footer />
        </div>

      </div>
    )
  }
}
