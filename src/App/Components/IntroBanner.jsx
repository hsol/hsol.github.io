import React from 'react'
import Typed from 'typed.js';

class TypedComponent extends React.Component {
   componentDidMount() {
      const { children } = this.props;
      const options = Object.assign({
         strings: children,
         typeSpeed: 90,
         backSpeed: 50,
      }, this.props);

      this.typed = new Typed(this.el, options);
   }

   componentWillUnmount() {
      this.typed.destroy();
   }

   render() {
      const TagName = this.props.tagName || 'span';
      const className = this.props.className || '';

      return (<TagName className={className}>
         <span className="is-size-1" ref={(el) => {
            this.el = el;
         }}></span>
      </TagName>);
   }
}

export default class IntroBanner extends React.Component {
   constructor(props) {
      super(props);

      this.state = {
         heroStyle: {}
      };

      this.handleScroll = this.handleScroll.bind(this);
   }

   handleScroll() {
      let displayHeight = window.innerHeight;
      let scrollTop = window.scrollY;

      this.setState({
         heroStyle: {
            transitionDuration: '.5s',
            minHeight: `${Math.min(Math.max(displayHeight / scrollTop * 5, 30), 100)}vh`
         }
      });
   }

   autoScrollFromTop() {
      setTimeout(() => {
         if (window.scrollY === 0) {
            window.scroll({
               top: this.banner.offsetHeight,
               left: 0,
               behavior: 'smooth'
            });
            setTimeout(() => {
               window.scrollTo(0, this.banner.offsetHeight);
               window.addEventListener('scroll', this.handleScroll)
            }, 1000)
         } else {
            window.addEventListener('scroll', this.handleScroll)
         }
      }, 2000)
   }

   componentDidMount() {
      setTimeout(() => {
         window.scrollTo(0, 0)
      }, 500)
   }

   componentWillUnmount() {
      window.removeEventListener('scroll', this.handleScroll);
   }

   render() {
      return (
         <section
            className="hero is-success has-bg-full-1 is-darken-4 is-fullheight"
            style={this.state.heroStyle}
            ref={(el) => {
               this.banner = el;
            }}
         >
            <div className="hero-body">
               <div className="container z-index-1">
                  <TypedComponent
                     tagName="h1"
                     className="title has-text-shadow-2 is-size-1-desktop is-size-3-tablet is-size-5-mobile"
                     strings={["안녕하세요,<br class='is-hidden-tablet'/><span class='has-text-primary is-size-1'>임한솔</span>입니다."]}
                     onComplete={this.autoScrollFromTop.bind(this)}>
                  </TypedComponent>
                  <h2 className="subtitle is-size-3">
                     <span className="has-margin-right-10 is-hidden-mobile"/>
                     <span className="tag is-light has-margin-right-5" data-aos="fade-up" data-aos-duration="500">매 순간 스스로 업그레이드 하는 개발자</span>
                     <span className="tag is-light has-margin-right-5" data-aos="fade-up" data-aos-duration="750">언어 가리지 않는 유연한 개발자</span>
                     <span className="tag is-light has-margin-right-5" data-aos="fade-up" data-aos-duration="1000">디자인 감각을 가진 부드러운 개발자</span>
                  </h2>
               </div>
            </div>
         </section>
      )
   }
}