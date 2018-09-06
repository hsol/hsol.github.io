import React from 'react'
import Section from 'Components/Base/Section'

export default class extends React.Component {
   constructor(props) {
      super(props);
   }

   render() {
      return (
         <Section className={this.props.className}>
            <header className="title has-text-centered has-text-white">교육</header>
            <hr className="header-assistant"/>
            <article className="container has-text-centered has-text-white">
               <ul>
                  <li className="has-margin-bottom-10"><span className="tag is-rounded">2018 ~</span> 건국대학교 신산업융합학과 재학.
                  </li>
                  <li className="has-margin-bottom-10"><span className="tag is-rounded">~ 2015</span> 선린 인터넷고등학교 정보통신과
                     졸업.
                  </li>
                  <li className="has-margin-bottom-10"><span className="tag is-rounded">~ 2012</span> 연희중학교 졸업.</li>
                  <li className="has-margin-bottom-10"><span className="tag is-rounded">~ 2009</span> 북가좌초등학교 졸업.</li>
               </ul>
            </article>
         </Section>
      )
   }
}