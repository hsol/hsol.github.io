import React from 'react'
import Section from 'Components/Base/Section'

import educations from 'Datas/educations.json'

export default class EducationSection extends React.Component {
   constructor(props) {
      super(props);
   }

   renderRecord(year, description) {
      return (<li className="has-margin-bottom-10">
         <span className="tag is-rounded has-margin-right-5">{year}</span>
         <span>{description}</span>
      </li>)
   }

   render() {
      return (
         <Section className={this.props.className}>
            <header className="title has-text-centered has-text-white">교육</header>
            <hr className="header-assistant"/>
            <article className="container has-text-centered has-text-white">
               <ul>
                  {Object.keys(educations).sort((a, b) => {
                     return b - a
                  }).map(year => {
                     return this.renderRecord(year, educations[year]);
                  })}
               </ul>
            </article>
         </Section>
      )
   }
}