import React from 'react'
import Section from 'Components/Base/Section'

class TechnologySection extends React.Component {
   constructor(props) {
      super(props);
   }

   render() {
      return (
         <Section className={this.props.className}>
            <header className="title has-text-centered">보유기술</header>
            <hr className="header-assistant"/>
            <article className="container">
               <div className="columns">
                  <div className="column is-child">
                     <h3 className="title is-size-4 has-text-right" data-global="web">언어</h3>
                     <ul>
                        <li className="has-margin-bottom-10 has-text-right">
                           <h4 className="is-size-5" data-global="web">웹</h4>
                           <div className="has-margin-right-15">
                              <p className="is-size-6" data-global="frontend">프론트엔드</p>
                              <p className="has-margin-right-10">Javascript(jQuery, React.js, VueJS ...), HTML, CSS
                                 ...</p>
                              <p className="is-size-6" data-global="backend">백엔드</p>
                              <p className="has-margin-right-10">php, Java, C#, Python, Node.js, C++ ...</p>
                           </div>
                        </li>
                        <li className="has-margin-bottom-10 has-text-right">
                           <h4 className="is-size-5" data-global="mobile">모바일</h4>
                           <div className="has-margin-right-15">
                              <p>Android. Java / iOS. Objective-C ...</p>
                           </div>
                        </li>
                        <li className="has-text-right">
                           <h4 className="is-size-5" data-global="database">Database</h4>
                           <div className="has-margin-right-15">
                              <p>MS-Sql, MySQL, ORACLE ...</p>
                           </div>
                        </li>
                     </ul>
                  </div>
                  <div className="is-divider" data-content="AND"/>
                  <div className="column">
                     <h3 className="title is-size-4" data-global="web">도구</h3>
                     <ul>
                        <li className="has-margin-bottom-10">
                           <h4 className="is-size-5" data-global="database">협업</h4>
                           <div className="has-margin-left-15">
                              <p>VCS(Git, SVN), Github, Asana, JIRA, Confluence, Slack ...</p>
                           </div>
                        </li>
                        <li className="has-margin-bottom-10">
                           <h4 className="is-size-5" data-global="database">개발</h4>
                           <div className="has-margin-left-15">
                              <p>IntelliJ IDEA(WebStorm, PhpStorm, DataGrip ... ), Eclipse, Visual Studio ...</p>
                           </div>
                        </li>
                        <li className="has-margin-bottom-10">
                           <h4 className="is-size-5" data-global="database">문서</h4>
                           <div className="has-margin-left-15">
                              <p>MS-Word, MS-PowerPoint, MS-Excel ...</p>
                           </div>
                        </li>
                        <li className="has-margin-bottom-10">
                           <h4 className="is-size-5" data-global="database">이미지</h4>
                           <div className="has-margin-left-15">
                              <p>Adobe Photoshop, Adobe illustrator ...</p>
                           </div>
                        </li>
                     </ul>
                  </div>
               </div>
            </article>
         </Section>
      )
   }
}

export default TechnologySection