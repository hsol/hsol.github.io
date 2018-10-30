import React from 'react'

export default class Navbar extends React.Component {
   render() {
      return (
         <section className="wrapper">
            <div className="navbar is-transparent"/>
            <nav className="navbar is-transparent is-darken-5 is-fixed-top" role="navigation"
                 aria-label="main navigation">
               <div className="navbar-brand">
                  <a className="navbar-item level-left z-index-1" href="/">
                     <div className="level-item image is-24x24 is-marginless">
                        <img src="./images/favicon/ms-icon-310x310.png"/>
                     </div>
                     <span className="has-margin-right-10 is-hidden-mobile"/>
                     <span className="level-item is-size-4 is-hidden-mobile has-text-white">임한솔</span>
                  </a>
               </div>
            </nav>
         </section>
      )
   }
}