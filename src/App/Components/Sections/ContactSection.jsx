import React from 'react'
import Section from 'Components/Base/Section'
import Utterance from 'Library/Utterance'

export default class extends React.Component {
   constructor(props) {
      super(props);
   }

   render() {
      return (
         <Section className={this.props.className}>
            <div className="hero is-medium has-padding-bottom-35">
               <div className="hero-body">
                  <div className="container has-text-centered">
                     <h1 className="title has-text-white is-size-2-desktop is-size-4-tablet is-size-5-mobile">"사람을 얻는 자는
                        번창하고, 사람을
                        잃는 자는
                        망한다."</h1>
                     <h2
                        className="subtitle has-text-grey-light is-size-4-desktop is-size-5-tablet is-size-7-mobile">여기까지
                        보셨다면, 이제
                        저에게
                        연락해보세요!</h2>
                  </div>
               </div>
               <Utterance className="hero-footer"/>
            </div>
         </Section>
      )
   }
}