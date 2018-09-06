import { bulmaAccordion, bulmaCarousel } from 'bulma-extensions'

export default class BulmaLoader {
   static attach() {
      bulmaAccordion.attach();
      bulmaCarousel.attach();
   }
}
