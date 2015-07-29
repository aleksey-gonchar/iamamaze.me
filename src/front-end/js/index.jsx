/*---- boot ----*/
let $ = window.jQuery = require('jquery')
window.React = require('react')
window.RB = require('react-bootstrap')

let IndexPage = require('./pages/IndexPage.jsx')

$(function () {
  React.render(<IndexPage/>, document.body)
})

