export const languageConst = { KR: 'korean', EN: 'english' };

export default class {
   static getData(filename, language = languageConst.KR) {
      const dataMap = require(`Datas/${filename}`).default;

      return dataMap[language] || dataMap
   }
}