import React, { PropTypes } from 'react'

import { Table } from 'react-bootstrap'

export default class Project extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    project: PropTypes.object
  }

  render () {
    const {period, customer, description,
      usedSoft, roleDescription, responsibilities} = this.props.project

    return (
      <li className='cv-project' key={this.props.id}>
        <div className='cv-project-period'>
          {period}
        </div>
        <div className='cv-project-details'>
          <Table condensed>
            <tbody>
            <tr>
              <td>Period</td>
              <td>{period}</td>
            </tr>
            <tr>
              <td>Client</td>
              <td>{customer}</td>
            </tr>
            <tr>
              <td>Project description</td>
              <td>{description}</td>
            </tr>
            <tr>
              <td>Used OS/soft</td>
              <td>{usedSoft}</td>
            </tr>
            <tr>
              <td>Role in project</td>
              <td>{roleDescription}</td>
            </tr>
            <tr>
              <td>Responsibilities</td>
              <td>{responsibilities}</td>
            </tr>
            </tbody>
          </Table>
        </div>
      </li>
    )
  }
}
