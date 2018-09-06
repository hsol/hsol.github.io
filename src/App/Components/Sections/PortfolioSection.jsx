import React from 'react'
import Section from 'Components/Base/Section'

export default class extends React.Component {
   constructor(props) {
      super(props);
   }

   render() {
      return (
         <Section className={this.props.className}>
            <header className="title has-text-centered">포트폴리오</header>
            <hr className="header-assistant"/>
            <article className="container carousel carousel-animated carousel-animate-slide carousel-cards"
                     data-autoplay="true">
               <div className="carousel-navigation">
                  <div className="carousel-nav-left">
                     <button type="button" className="button is-dark is-outlined is-small">이전 프로젝트</button>
                  </div>
                  <div className="carousel-nav-right">
                     <button type="button" className="button is-dark is-outlined is-small">다음 프로젝트</button>
                  </div>
               </div>
               <div className="carousel-container columns">
                  <div className="column carousel-item">
                     <div className="card">
                        <header className="card-header has-background-white toggle">
                           <div className="media card-header-title">
                              <div className="media-left">
                                 <figure className="image is-64x64">
                                    <img src="./images/portfolios/mingginyu.jpg"/>
                                 </figure>
                              </div>
                              <div className="media-content ">
                                 <p className="is-size-6 has-text-weight-bold">내 친구 밍기뉴 (Mingginyua)</p>
                                 <p className="subtitle is-size-7">IoT 스마트 화분</p>
                              </div>
                           </div>
                        </header>
                        <article className="card-content">
                           <div className="content">
                              <p><label data-global="period">개발기간</label>. 2<span data-global="day">일</span></p>
                              <p><label data-global="role">역할</label>. <span data-global="frontend">프론트엔드</span>, <span
                                 data-global="backend">백엔드</span></p>
                              <p><label data-global="link">바로가기</label>. <a href="https://github.com/Nexters/mingginyu"
                                                                            target="_blank">https://github.com/Nexters/mingginyu</a>
                              </p>
                           </div>
                        </article>
                     </div>
                  </div>
                  <div className="column carousel-item">
                     <div className="card">
                        <header className="card-header has-background-white toggle">
                           <div className="media card-header-title">
                              <div className="media-left">
                                 <figure className="image is-64x64">
                                    <img src="./images/portfolios/pizzaalvolo.jpg"/>
                                 </figure>
                              </div>
                              <div className="media-content">
                                 <p className="is-size-6 has-text-weight-bold">피자알볼로</p>
                                 <p className="subtitle is-size-7">홈페이지 및 주문시스템</p>
                              </div>
                           </div>
                        </header>
                        <article className="card-content">
                           <div className="content">
                              <p><label data-global="period">개발기간</label>. 3<span data-global="month">개월</span></p>
                              <p><label data-global="role">역할</label>. <span data-global="frontend">프론트엔드</span>, <span
                                 data-global="backend">백엔드</span></p>
                              <p><label data-global="link">바로가기</label>. <a href="https://pizzaalvolo.co.kr"
                                                                            target="_blank">https://pizzaalvolo.co.kr</a>
                              </p>
                           </div>
                        </article>
                     </div>
                  </div>
                  <div className="column carousel-item">
                     <div className="card">
                        <header className="card-header has-background-white toggle">
                           <div className="media card-header-title">
                              <div className="media-left">
                                 <figure className="image is-64x64">
                                    <img src="./images/portfolios/pizzamaru.jpg"/>
                                 </figure>
                              </div>
                              <div className="media-content">
                                 <p className="is-size-6 has-text-weight-bold">피자마루</p>
                                 <p className="subtitle is-size-7">홈페이지</p>
                              </div>
                           </div>
                        </header>
                        <article className="card-content">
                           <div className="content">
                              <p><label data-global="period">개발기간</label>. 2<span data-global="month">개월</span></p>
                              <p><label data-global="role">역할</label><span data-global="frontend">프론트엔드</span>, <span
                                 data-global="backend">백엔드</span></p>
                              <p><label data-global="link">바로가기</label>. <a href="http://pizzamaru.co.kr"
                                                                            target="_blank">http://pizzamaru.co.kr/</a>
                              </p>
                           </div>
                        </article>
                     </div>
                  </div>
                  <div className="column carousel-item">
                     <div className="card">
                        <header className="card-header has-background-white toggle">
                           <div className="media card-header-title">
                              <div className="media-left">
                                 <figure className="image is-64x64">
                                    <img src="./images/portfolios/coffeezarii.jpg"/>
                                 </figure>
                              </div>
                              <div className="media-content">
                                 <p className="is-size-6 has-text-weight-bold">커피자리</p>
                                 <p className="subtitle is-size-7">홈페이지</p>
                              </div>
                           </div>
                        </header>
                        <article className="card-content">
                           <div className="content">
                              <p><label data-global="period">개발기간</label>. 1<span data-global="month">개월</span></p>
                              <p><label data-global="role">역할</label>. <span data-global="frontend">프론트엔드</span>, <span
                                 data-global="backend">백엔드</span></p>
                              <p><label data-global="link">바로가기</label>. <a href="http://coffeezarii.com/"
                                                                            target="_blank">http://coffeezarii.com/</a>
                              </p>
                           </div>
                        </article>
                     </div>
                  </div>
                  <div className="column carousel-item">
                     <div className="card">
                        <header className="card-header has-background-white toggle">
                           <div className="media card-header-title">
                              <div className="media-left">
                                 <figure className="image is-64x64">
                                    <img src="./images/portfolios/mosburger.jpg"/>
                                 </figure>
                              </div>
                              <div className="media-content">
                                 <p className="is-size-6 has-text-weight-bold">모스버거</p>
                                 <p className="subtitle is-size-7">주문 시스템</p>
                              </div>
                           </div>
                        </header>
                        <article className="card-content">
                           <div className="content">
                              <p><label data-global="period">개발기간</label>. 3<span data-global="month">개월</span></p>
                              <p><label data-global="role">역할</label>. <span data-global="frontend">프론트엔드</span>, <span
                                 data-global="backend">프론트엔드</span></p>
                              <p><label data-global="link">바로가기</label>. <a href="http://delivery.moskorea.kr/"
                                                                            target="_blank">http://delivery.moskorea.kr/</a>
                              </p>
                           </div>
                        </article>
                     </div>
                  </div>
                  <div className="column carousel-item">
                     <div className="card">
                        <header className="card-header has-background-white toggle">
                           <div className="media card-header-title">
                              <div className="media-left">
                                 <figure className="image is-64x64">
                                    <img src="./images/portfolios/thecontest.jpg"/>
                                 </figure>
                              </div>
                              <div className="media-content">
                                 <p className="is-size-6 has-text-weight-bold">더 콘테스트</p>
                                 <p className="subtitle is-size-7">Android, iOS 어플리케이션</p>
                              </div>
                           </div>
                        </header>
                        <article className="card-content">
                           <div className="content">
                              <p><label data-global="period">개발기간</label>. 6<span data-global="month">개월</span></p>
                              <p><label data-global="role">역할</label>. <span data-global="android">안드로이드</span>, <span
                                 data-global="ios">아이폰</span></p>
                              <p><label data-global="link">바로가기</label>. <a href="http://theconte.st/androidapp-f"
                                                                            target="_blank"
                                                                            data-global="android">안드로이드</a>, <a
                                 href="http://theconte.st/iosapp-thecontest-f" target="_blank"
                                 data-global="ios">아이폰</a></p>
                           </div>
                        </article>
                     </div>
                  </div>
               </div>
            </article>
         </Section>
      )
   }
}