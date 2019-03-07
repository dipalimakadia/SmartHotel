import React from 'react';
import Sidebar from '../layout/Sidebar';

export default  ()  => {
  return (

    <div class="page-container row-fluid">
		 <Sidebar/>
      <div class="page-content custom-position-right">
        <div class="container-fluid">
          <div class="row-fluid">
            <div class="span12">
              <h3 class="page-title">
                Dashboard
                <br/>
                <small>This is the dashboard for Administrator</small>
              </h3>
            </div>
          </div>
          <hr></hr>
          <div class="row-fluid">
            <div class="span12">
                <h1>Welcome Admin</h1>
            </div>
          </div>
        </div>
      </div>
	  </div>

  )
}
