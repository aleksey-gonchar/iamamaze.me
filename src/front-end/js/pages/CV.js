import React from 'react'

import Navigation from '../components/Navigation.js'
import Footer from '../components/Footer.js'

import Contact from '../components/CV/Contact.js'
import Education from '../components/CV/Education.js'
import Hobbies from '../components/CV/Hobbies.js'
import Languages from '../components/CV/Languages.js'
import Projects from '../components/CV/Projects.js'
import Skills from '../components/CV/Skills.js'
import Summary from '../components/CV/Summary.js'

export default class CV extends React.Component {
  // this complex fetch is used for server render when router inits
  static fetchState (store, params, query) {
    return Promise.all([
      Summary.WrappedComponent.fetchState(store),
      Contact.WrappedComponent.fetchState(store),
      Education.WrappedComponent.fetchState(store),
      Hobbies.WrappedComponent.fetchState(store),
      Languages.WrappedComponent.fetchState(store),
      Projects.WrappedComponent.fetchState(store),
      Skills.WrappedComponent.fetchState(store)
    ])
  }

  render () {
    return (
      <div>
        <Navigation />
        <div className='container-fluid page-content page-cv'>
          <div className='row'>
            <div className='col-md-12 col-xs-12'>
              <h1>CV</h1>
            </div>
            <div className='col-md-8 col-xs-8'>
              <Summary/>
              <Skills/>
              <Education/>
            </div>
            <div className='col-md-4 col-xs-4'>
              <Contact/>
              <Languages/>
              <Hobbies/>
            </div>
            <div className='col-md-12 col-xs-12'>
              <Projects/>
            </div>
          </div>
          <Footer/>
        </div>

      </div>
    )
  }
}
