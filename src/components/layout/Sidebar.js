import React from 'react';
import '../../assets/css/default.css';
import { NavLink } from 'react-router-dom'

export default () => {
  return (
      <div className="page-sidebar custom-position-leftbar">
        <ul className="page-sidebar-menu">
          <li className="active ">
            <a>
            <i className="icon-key"></i>
            <span className="title">Key Management</span>
            </a>
            <ul className="sub-menu">
              <li>
                  <NavLink
                    to="/generatekey"
                    activeClassName="active"
                  >Generate Key</NavLink>
              </li>

              <li>
                  <NavLink
                    to="/deletekey"
                    activeClassName="active"
                  >Delete Key</NavLink>
              </li>
            </ul>
          </li>
          <li className="active">
            <a>
            <i className="icon-list"></i>
            <span className="title">Log</span>
            </a>
            <ul className="sub-menu">
              <li>
                  <NavLink
                    to="/UserAccessLog"
                    activeClassName="active"
                  >User Access Log</NavLink>
              </li>
            </ul>
          </li>
        </ul>
      </div>
  )
}
