import React from 'react'

class Footer extends React.Component {
   render() {
      return (
         <footer className="card has-background-white">
            <div className="card-footer">
               <a className="card-footer-item" href="https://www.linkedin.com/in/devhansollim/" target="_blank">Linkedin<span
                  className="is-hidden-mobile"> 에서 만나기</span></a>
               <a className="card-footer-item" href="https://open.kakao.com/o/sD6Ru3j" target="_blank">Kakaotalk<span
                  className="is-hidden-mobile">으로 연락하기</span></a>
               <a className="card-footer-item" href="https://facebook.com/molmoty" target="_blank">Facebook <span
                  className="is-hidden-mobile">에서 만나기</span></a>
            </div>
         </footer>
      )
   }
}

export default Footer