import React from 'react'

export default class Section extends React.Component {
   constructor (props) {
      super(props);

      this.dataProps = this.getDataProps(props)
   }

   getDataProps(props) {
      return Object.keys(props).reduce((map, key) => {
         if (/^data-/.test(key)) {
            map[key] = props[key];
         }

         return map;
      }, {});
   }

   render() {
      return (
         <section className={['section', this.props.className].join(' ')}
                  {...this.dataProps}>{this.props.children}</section>
      );
   }
}