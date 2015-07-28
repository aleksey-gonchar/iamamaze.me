/*---- boot ----*/
import $ from 'jquery'
import jQuery from 'jquery'
window.jQuery = jQuery // bootstrap depends on window.jQuery to be present
import React from 'react'
import HelloWorld from './components/HelloWorld/HelloWorld.jsx'
//import 'bootstrap'

$(function () {
  React.render(<HelloWorld />, document.body)
})
