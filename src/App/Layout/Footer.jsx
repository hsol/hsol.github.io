import React from 'react'

export default class Footer extends React.Component {
   openKakaoPopup(event) {
      event.preventDefault();

      window.open('https://open.kakao.com/o/sD6Ru3j', 'Kakotalk to HansolLim', 'width=600,height=800');
      return false;
   }

   render() {
      return (
         <footer className="card has-background-white">
            <div className="card-footer">
               <a className="card-footer-item" href="https://www.linkedin.com/in/devhansollim/" target="_blank">Linkedin<span
                  className="is-hidden-mobile"> 에서 만나기</span></a>
               <a className="card-footer-item" href="https://open.kakao.com/o/sD6Ru3j" target="popup"
                  onClick={this.openKakaoPopup}>Kakaotalk<span
                  className="is-hidden-mobile">으로 연락하기</span></a>
               <a className="card-footer-item" href="https://facebook.com/molmoty" target="_blank">Facebook <span
                  className="is-hidden-mobile">에서 만나기</span></a>
            </div>
         </footer>
      )
   }
}