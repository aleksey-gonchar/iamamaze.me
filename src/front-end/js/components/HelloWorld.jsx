/* global React */
export default React.createClass({
  displayName: 'HelloWorld',

  render () {
    return (
      <div className='container-fluid'>
        <div className='jumbotron'>
          <h1><i className='fa fa-fw fa-rocket'></i>Hello world</h1>
        </div>
      </div>
    )
  }
})
