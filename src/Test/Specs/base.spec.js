import server from '../server'

it('index.html should be 200 response', async () => {
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