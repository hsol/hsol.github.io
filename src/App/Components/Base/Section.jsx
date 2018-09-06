import React from 'react'

export default class extends React.Component {
   render () {
      return (
         <section className={['section', this.props.className].join(' ')}>{this.props.children}</section>
      );
   }
}