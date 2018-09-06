import React from 'react'
import Section from 'Components/Base/Section'

export default class ExperienceSection extends React.Component {
   constructor(props) {
      super(props);
   }

   render() {
      return (
         <Section className={this.props.className}>
            <header className="title has-text-centered">경험</header>
            <hr className="header-assistant"/>
            <article className="container">
               <ul className="has-text-centered">
                  <li>
                     <h2 className="is-size-4 has-margin-bottom-5">2017</h2>
                     <p data-global="nexters10th">넥스터즈 10기 활동</p>
                     <h2 className="is-size-4 has-margin-top-10 has-margin-bottom-5">2016</h2>
                     <p data-global="xecon2016"><a target="_blank" href="http://hsol.tistory.com/937">XEcon 2016</a>
                     </p>
                     <p data-global="joinridi"><a target="_blank" href='http://www.ridicorp.com/'>리디(주)</a> 입사</p>
                     <p data-global="leftcnttech"><a target="_blank" href='http://cntt.co.kr/'>씨엔티테크(주)</a> 퇴사</p>
                     <p data-global="gdgdevfest2016"><a target="_blank" href="http://hsol.tistory.com/936">GDG
                        Devfest Seoul 2016</a></p>
                     <p data-global="naverdeview2016"><a target="_blank" href="http://hsol.tistory.com/934">네이버 D2
                        DEVIEW 2016</a></p>
                     <p data-global="military">8월 25일 ~ 9월 22일 훈련소</p>
                     <p data-global="nexters_op">넥스터즈 10기 운영진(CTO)</p>
                     <p data-global="unithon_3">제 3회 유니톤 참가(수상)</p>
                     <p data-global="nexters9th">넥스터즈 9기 활동</p>
                     <h2 className="is-size-4 has-margin-top-10 has-margin-bottom-5">2015</h2>
                     <p data-global="erdmodeling">ERD를 이용한 DB 모델링 세미나</p>
                     <p data-global="facebookmeetup">페이스북 개발자 그룹의 첫 번째 미트업</p>
                     <p data-global="teheranmeet">테헤란로 커피클럽(아침에 하는 스타트업 네트워킹 모임)_36th</p>
                     <h2 className="is-size-4 has-margin-top-10 has-margin-bottom-5">2014</h2>
                     <p data-global="joincnttech"><a target="_blank" href='http://cntt.co.kr/'>씨엔티테크(주)</a> 입사</p>
                     <p data-global="datahackathon">2014 빅데이톤 경진대회(수상)</p>
                     <p>Google HackFair</p>
                     <h2 className="is-size-4 has-margin-top-10 has-margin-bottom-5">2013</h2>
                     <p><span data-global="googlehackathon">구글 학생 개발자 해커톤</span> 2013</p>
                     <h2 className="is-size-4 has-margin-top-10 has-margin-bottom-5">2012</h2>
                     <p><span data-global="googlehackathon">구글 학생 개발자 해커톤</span> 2012</p>
                  </li>
               </ul>
            </article>
         </Section>
      )
   }
}