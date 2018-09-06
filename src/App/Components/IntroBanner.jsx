import React from 'react'

class IntroBanner extends React.Component {
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

   componentDidMount() {
      window.addEventListener('scroll', this.handleScroll);
   }

   componentWillUnmount() {
      window.removeEventListener('scroll', this.handleScroll);
   }

   render() {
      return (
         <section
            className="hero is-success has-bg-full-1 is-darken-4 is-fullheight"
            style={this.state.heroStyle}
         >
            <div className="hero-body">
               <div className="container z-index-1">
                  <h1 className="title has-text-shadow-2 is-size-1-desktop is-size-3-tablet is-size-5-mobile">
                     안녕하세요,<br className="is-hidden-tablet"/>
                     <span className="has-text-primary is-size-1">임한솔</span>
                     입니다.</h1>
                  <h2 className="subtitle is-size-3">
                     <span className="has-margin-right-10 is-hidden-mobile"/>
                     <span className="tag is-light has-margin-right-5">매 순간 스스로 업그레이드 하는 개발자</span>
                     <span className="tag is-light has-margin-right-5">언어 가리지 않는 유연한 개발자</span>
                     <span className="tag is-light has-margin-right-5">디자인 감각을 가진 부드러운 개발자</span>
                  </h2>
               </div>
            </div>
         </section>
      )
   }
}

export default IntroBanner