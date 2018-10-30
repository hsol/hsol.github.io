import React from 'react'
import Section from '../../Components/Base/Section'

export default class ProfileSection extends React.Component {
   constructor(props) {
      super(props);
   }

   render() {
      return (
         <Section {...this.props}>
            <header className="title has-text-centered">프로필</header>
            <hr className="header-assistant"/>
            <article className="container">
               <div className="columns is-clearfix">
                  <div className="column is-clearfix is-pulled-right">
                     <figure className="image is-384x384 is-pulled-right is-desktop">
                        <img src="./images/profile.png"/>
                     </figure>
                  </div>
                  <ul className="column is-pulled-left">
                     <li className="has-margin-bottom-10">
                        <label className="is-size-7" data-global="name">이름</label>. <span
                        data-global="name_value">임한솔</span>
                     </li>
                     <li className="has-margin-bottom-10">
                        <label className="is-size-7" data-global="birth">출생년도</label>. <span
                        data-global="birth_value">1996년 05월 20일</span>
                     </li>
                     <li className="has-margin-bottom-10">
                        <label className="is-size-7" data-global="email">이메일</label>. <a
                        href="mailto:dev.hansollim@gmail.com">dev.hansollim@gmail.com</a>
                     </li>
                     <li>
                        <hr/>
                     </li>
                     <li className="has-margin-bottom-10">
                        <label className="is-size-7" data-global="blog">Github</label>. <a
                        className="is-size-6 is-size-7-mobile"
                        href="https://github.com/hsol/"
                        target="_blank">@hsol</a>
                     </li>
                     <li className="has-margin-bottom-10">
                        <label className="is-size-7" data-global="blog">링크드인</label>. <a
                        className="is-size-6 is-size-7-mobile"
                        href="https://www.linkedin.com/in/devhansollim/"
                        target="_blank">@devhansollim</a>
                     </li>
                     <li>
                        <label className="is-size-7" data-global="blog">블로그</label>. <a
                        className="is-size-6 is-size-7-mobile"
                        href="https://hsol.tistory.com"
                        target="_blank">https://hsol.tistory.com</a>
                     </li>
                  </ul>
               </div>
            </article>
         </Section>
      )
   }
}