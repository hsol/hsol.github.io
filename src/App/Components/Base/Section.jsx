import React from 'react'

export default class Section extends React.Component {
   render () {
      return (
         <section className={['section', this.props.className].join(' ')}>{this.props.children}</section>
      );
   }
}