import React from 'react'
import Section from '../../Components/Base/Section'
import Global from 'Library/Global'

import { bulmaCarousel } from 'bulma-extensions'

export default class PortfolioSection extends React.Component {
   constructor(props) {
      super(props);

      this.state = {
         items: [],
         sizeSync: {}
      }
   }

   componentDidMount() {
      this.fetchItems();

      bulmaCarousel.attach();

      window.onresize = () => this.setState({ sizeSync: { width: document.querySelector('[data-size-target]').clientWidth } })
      window.onresize();
   }

   fetchItems() {
      this.setState({ items: Global.getData('portfolios') })
   }

   render() {
      return (
         <Section {...this.props}>
            <header className="title has-text-centered">포트폴리오</header>
            <hr className="header-assistant"/>
            <p className="has-text-centered"><a className="tag is-info" href="/documents/임한솔_포트폴리오.pdf" target="_blank">파일로
               다운로드</a></p>
            <article className="container carousel carousel-animated carousel-animate-slide carousel-cards"
                     data-autoplay="true" data-size-target="portfolios">
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
                     return <div key={index} className="column carousel-item" style={this.state.sizeSync}>
                        <div className="card is-active">
                           <header className="card-header has-background-white toggle">
                              <div className="media card-header-title">
                                 <div className="media-left">
                                    {item.images.length > 0 &&
                                    <figure className="image is-64x64"><img src={item.images[0]}/></figure>}
                                 </div>
                                 <div className="media-content">
                                    <p className="is-size-6 has-text-weight-bold">{item.title}</p>
                                    <p className="subtitle is-size-7">
                                       {item.subtitle}<br/>
                                       {item.link && <a className='is-size-7' href={item.link}>{item.link}</a>}
                                    </p>
                                 </div>
                              </div>
                           </header>
                           <article className="card-content">
                              <div className="content">
                                 {item.images.length > 1 &&
                                 <figure className="image is-64x64">
                                    {item.images.map((image, index) => {
                                       return index !== 0 ? <img key={index} src={image}/> : null
                                    }).filter(image => image !== null)}
                                 </figure>}
                                 <div style={{overflow: 'hidden', whiteSpace: 'nowrap'}}>
                                    {item.languages.map((lang, index) => {
                                       return <label key={index}
                                                     className="tag is-light has-margin-right-5">{lang}</label>;
                                    })}
                                    {item.period ? <label
                                       className="tag is-grey-light is-pulled-right is-hidden-touch">{item.period}</label> : ''}
                                 </div>
                                 <pre>{item.about}</pre>
                              </div>
                           </article>
                        </div>
                     </div>
                  })}
               </div>
            </article>
         </Section>
      )
   }
}
