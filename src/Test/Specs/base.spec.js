import server from '../server'
import base from '../../Legacy/base'

it('base.em', async () => {
   return new Promise((resolve) => {
      server.get('/')
         .then(res => {
            res.should.have.status(200)
         })
         .catch(err => {
            throw err
         })
         .finally(resolve)
   });
});