
export default class TokenStats {


init()
{
  console.log('Loading token stats')
  this.loadTokenStats();

}

//move me


 async loadTokenStats() {
     console.log('loading token stats');

    let elem = document.getElementById('tokenStats');


    var tokenStats = await this.getAPIData();
    console.log('loaded stats', tokenStats)


}


async getAPIData()
{
  return new Promise((resolve, reject) => {
    $.getJSON('http://api.bsov.info', function(data) {
      resolve(data);
    });
  });
}


}
