import React from 'react'
import Section from '../../Components/Base/Section'

import Global from 'Library/Global'

export default class EducationSection extends React.Component {
   constructor(props) {
      super(props);

      this.state = { items: {} }
   }

   renderRecord(year, description) {
      return (<li key={year} className="has-margin-bottom-10">
         <span className="tag is-rounded has-margin-right-10">{year}</span>
         <span>{description}</span>
      </li>)
   }

   fetchItems() {
      this.setState({ items: Global.getData('educations') })
   }

   componentDidMount() {
      this.fetchItems()
   }

   render() {
      return (
         <Section {...this.props}>
            <header className="title has-text-centered has-text-white">교육</header>
            <hr className="header-assistant"/>
            <article className="container has-text-centered has-text-white">
               <ul>{Object.keys(this.state.items).sort((a, b) => parseInt(b) - parseInt(a)).map(year => {
                  return this.renderRecord(year, this.state.items[year]);
               })}</ul>
            </article>
         </Section>
      )
   }
}