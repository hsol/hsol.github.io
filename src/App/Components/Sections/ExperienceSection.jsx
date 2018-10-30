import React from 'react'
import Section from '../../Components/Base/Section'

import Global from 'Library/Global'

export default class ExperienceSection extends React.Component {
   constructor(props) {
      super(props);

      this.state = {
         items: []
      }
   }

   fetchItems() {
      this.setState({ items: Global.getData('experiences') })
   }

   reduceGroupByYear(acc, index) {
      const item = this.state.items[index];
      const itemYear = new Date(item.datetime).getFullYear();

      if (acc[itemYear] === undefined) {
         acc[itemYear] = [];
         acc[itemYear].push(<li key={itemYear}
                                className="is-size-4 has-margin-top-5 has-margin-bottom-5">{itemYear}</li>);
      }
      acc[itemYear].push((<li key={index}>{item.description}</li>));

      return acc;
   }

   componentDidMount() {
      this.fetchItems();
   }

   render() {
      return (
         <Section {...this.props}>
            <header className="title has-text-centered">경험</header>
            <hr className="header-assistant"/>
            <article className="container">
               <ul className="has-text-centered">{Object.values(
                  Object.keys(this.state.items)
                     .reduce(this.reduceGroupByYear.bind(this), {})
               )}</ul>
            </article>
         </Section>
      )
   }
}