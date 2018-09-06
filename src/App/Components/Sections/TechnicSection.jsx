import React from 'react'
import Section from 'Components/Base/Section'

import Global from 'Library/Global'

export default class TechnicSection extends React.Component {
   constructor(props) {
      super(props);

      this.state = { items: {} }
   }

   renderList(item, direction, nestLevel, isNested = false) {
      const CustomTag = isNested ? 'div' : 'li';

      return (
         <CustomTag className={`has-margin-bottom-10 has-text-${direction}`}>
            {Object.keys(item).map(title => {
               return (
                  <div key={title}>
                     <h4 className={`is-size-${nestLevel}`}>{title}</h4>
                     <div className={`has-margin-${direction}-10`}>
                        {item[title] instanceof Object ? this.renderList(item[title], direction, nestLevel + 1, true) : item[title]}
                     </div>
                  </div>
               )
            })}
         </CustomTag>
      )
   }

   fetchItems() {
      this.setState({ items: Global.getData('technics') })
   }

   componentDidMount() {
      this.fetchItems()
   }

   render() {
      return (
         <Section className={this.props.className}>
            <header className="title has-text-centered">보유기술</header>
            <hr className="header-assistant"/>
            <article className="container">
               <div className="columns">
                  {
                     Object.keys(this.state.items)
                        .map((title, index) => {
                           const direction = index === 0 ? 'right' : 'left';

                           return (
                              <div key={index} className="column is-child">
                                 <h3 className={`title is-size-4 has-text-${direction}`}>{title}</h3>
                                 <ul>{this.renderList(this.state.items[title], direction, 5)}</ul>
                              </div>
                           )
                        })
                        .reduce((r, a) => r.concat(a, (<div key="none" className="is-divider" data-content="AND"/>)), [])
                        .filter((data, index, arr) => arr.length - 1 !== index)
                  }
               </div>
            </article>
         </Section>
      )
   }
}