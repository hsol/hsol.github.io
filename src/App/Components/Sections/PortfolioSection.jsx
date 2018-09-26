import React from 'react'
import Section from 'Components/Base/Section'
import Global from 'Library/Global'

import {bulmaCarousel} from 'bulma-extensions'

export default class PortfolioSection extends React.Component {
   constructor(props) {
      super(props);

      this.state = {
         items: []
      }
   }

   componentDidMount() {
      this.fetchItems();
      bulmaCarousel.attach();
   }

   fetchItems() {
      this.setState({items: Global.getData('portfolios')})
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
                  {this.state.items.map((item, index) => {
                     return <div className="column carousel-item">
                        <div key={index} className='card'>{item.title}</div>
                     </div>
                  })}
                  {/*<div className="column carousel-item">*/}
                  {/*<div className="card">*/}
                  {/*<header className="card-header has-background-white toggle">*/}
                  {/*<div className="media card-header-title">*/}
                  {/*<div className="media-left">*/}
                  {/*<figure className="image is-64x64">*/}
                  {/*<img src="./images/portfolios/thecontest.jpg"/>*/}
                  {/*</figure>*/}
                  {/*</div>*/}
                  {/*<div className="media-content">*/}
                  {/*<p className="is-size-6 has-text-weight-bold">더 콘테스트</p>*/}
                  {/*<p className="subtitle is-size-7">Android, iOS 어플리케이션</p>*/}
                  {/*</div>*/}
                  {/*</div>*/}
                  {/*</header>*/}
                  {/*<article className="card-content">*/}
                  {/*<div className="content">*/}
                  {/*<p><label data-global="period">개발기간</label>. 6<span data-global="month">개월</span></p>*/}
                  {/*<p><label data-global="role">역할</label>. <span data-global="android">안드로이드</span>, <span*/}
                  {/*data-global="ios">아이폰</span></p>*/}
                  {/*<p><label data-global="link">바로가기</label>. <a href="http://theconte.st/androidapp-f"*/}
                  {/*target="_blank"*/}
                  {/*data-global="android">안드로이드</a>, <a*/}
                  {/*href="http://theconte.st/iosapp-thecontest-f" target="_blank"*/}
                  {/*data-global="ios">아이폰</a></p>*/}
                  {/*</div>*/}
                  {/*</article>*/}
                  {/*</div>*/}
                  {/*</div>*/}
               </div>
            </article>
         </Section>
      )
   }
}
