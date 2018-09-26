import {languageConst} from "../Library/Global"
import moment from 'moment'

export class Portfolio {
  constructor() {
    this.title = '';
    this.subtitle = '';
    this.link = '';

    this.startDate = null;
    this.endDate = null;

    this.period = '';

    this.images = [];
  }

  static create(title) {
    return (new Portfolio).setTitle(title);
  }

  setStartDate (startDate) {
    this.startDate = moment(startDate);
  }

  setEndDate (endDate) {
    this.endDate = moment(endDate);
  }

  setPeriod(startDate = null, endDate = null) {
    if (startDate !== null) {
      this.setStartDate(startDate)
    }

    if (endDate !== null) {
      this.setEndDate(endDate)
    }

    if (this.startDate !== null && this.endDate !== null) {
      this.period = this.startDate.from(this.endDate, true);
    }

    return this;
  }

  setTitle(title) {
    this.title = title;

    return this;
  }

  setSubtitle(subtitle) {
    this.subtitle = subtitle;

    return this;
  }

  setLink(link) {
    this.link = link;

    return this;
  }

  addImage(image) {
    this.images.push(image);

    return this;
  }
}

export default {
  [languageConst.KR]: [
    Portfolio.create('내 친구 밍기뉴 (Mingginyua)')
      .setPeriod('2016')
      .setSubtitle('IoT 스마트 화분')
      .setLink('https://github.com/Nexters/mingginyu')
  ]
}
