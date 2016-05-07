import React from 'react'
import moment from 'moment'

import { Icon } from './helpers/FontAwesome.js'

export default class Footer extends React.Component {
  render () {
    const socials = (
      <div className='pull-right'>
        <a href='http://telegram.me/tuiteraz'>
          <span className='fa-stack fa-lg'>
            <i className='fa fa-circle fa-stack-2x'/>
            <i className='fa fa-paper-plane fa-stack-1x fa-inverse'/>
          </span>
        </a>
        <a href='https://fb.com/gonchara.net'>
          <span className='fa-stack fa-lg'>
            <i className='fa fa-circle fa-stack-2x'/>
            <i className='fa fa-facebook fa-stack-1x fa-inverse'/>
          </span>
        </a>
        <a href='https://ua.linkedin.com/in/alekseygonchar'>
          <span className='fa-stack fa-lg'>
            <i className='fa fa-circle fa-stack-2x'/>
            <i className='fa fa-linkedin fa-stack-1x fa-inverse'/>
          </span>
        </a>
        <a href='https://github.com/aleksey-gonchar'>
          <span className='fa-stack fa-lg'>
            <i className='fa fa-circle fa-stack-2x'/>
            <i className='fa fa-github-alt fa-stack-1x fa-inverse'/>
          </span>
        </a>
      </div>
    )

    return (
      <div className='row' data-class='Footer'>
        <div className='col-xs-12 col-md-12'>
          <table>
            <tbody>
              <tr>
                <td>
                  <Icon name='copyright'/>&nbsp;
                  { moment().format('YYYY')}&nbsp;
                  <span className='name'>Alex Potter</span>
                  <span className='sub-title'> - Full stack javascript developer</span>
                </td>
                <td>
                  {socials}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
