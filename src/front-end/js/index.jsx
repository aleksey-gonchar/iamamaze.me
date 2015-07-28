/*---- boot ----*/
let $ = window.jQuery = require('jquery')
require('bootstrap')
import React from 'react'
import HelloWorld from './components/HelloWorld/HelloWorld.jsx'

$(function () {
  React.render(<HelloWorld />, document.body)
})
