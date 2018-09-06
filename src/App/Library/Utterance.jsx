import React from 'react'

export default class extends React.Component {
   constructor (props) {
      super(props);

      this.component = React.createRef();
   }

   componentWillMount() {
      document.head.insertAdjacentHTML('beforeend', '<link rel="prefetch" href="https://utteranc.es/client.js" />');
      document.head.insertAdjacentHTML('beforeend', '<link rel="preload" href="https://utteranc.es/client.js" as="script" />');
   }

   componentDidMount() {
      const script = document.createElement('script');

      script.src = 'https://utteranc.es/client.js';
      script.async = true;
      script.setAttribute('repo', 'hsol/hsol.github.io');
      script.setAttribute('issue-number', '3');
      script.setAttribute('crossorigin', 'anonymous');

      this.component.current.appendChild(script);
   }

   render () {
      return (<div className={this.props.className} ref={this.component}/>)
   }
}