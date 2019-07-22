const Chart = require('./chart.min');

function generateHoldersGraph(holders, minted) {

  var amount = [];
  var label_list = [];
  var colors = [];

  colors.push('#d55a01');
  colors.push('#2ab500');
  colors.push('#08457e');
  colors.push('#e1a95f');

  // Used to get the 'other' holders
  var sum = 0;

  for(var i = 0; i < holders.length; i++) {

    amount.push(holders[i][2]); // holders[i][2] returns 0xbtc balance
    label_list.push(`#${i+1} ${holders[i][0].substring(0,10)}... ${isExchange(holders[i][0])} (${((amount[i] * 100) / minted).toFixed(3)}%)`); // Pushes address label and a string, wallet or dex.
    // holders[i][0] returns wallet address holders
    // [i][1] returns string 'dex' or 'wallet'

    sum += holders[i][2];
    //Random color
    var randomColor = "#000000".replace(/0/g,function randomColor() {return (~~(Math.random()*16)).toString(16);});
    colors.push(randomColor);
  }

  // This pushes the 'Other Wallets Total'
//  amount.unshift(Math.round(minted - sum));
//  label_list.unshift(`Other Wallets Total (${((amount[0] * 100) / minted).toFixed(3)}% of Supply)`);

  var data = {
      datasets: [{
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: `0`,
        hoverBorderWidth: `5`,
        hoverBorderColor: colors,
        data: amount
      }],

      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: label_list
  };

  var myPieChart = new Chart(document.getElementById('pie-holders').getContext('2d'), {
    type: 'pie',
    data: data,
    options: {
         legend: {
            display: false
         }
    }
  });
}

async function getTokenHolders() {
  return new Promise((resolve, reject) => {
      $.getJSON('https://api.allorigins.win/get?url='
      + encodeURIComponent('https://api.bloxy.info/token/token_holders_list?token=0x26946ada5ecb57f3a1f91605050ce45c482c9eb1&limit=500&key=ACCl2UPf2Pgqi&format=table')
      + '&callback=?', function(data) {
      resolve(JSON.parse(data.contents));
      });
    });
  }

async function getWallets() {
  return new Promise((resolve, reject) => {
    $.getJSON('https://api.ethplorer.io/getTokenInfo/0x26946adA5eCb57f3A1F91605050Ce45c482C9Eb1?apiKey=freekey', function(data) {
    resolve(data);
      });
    });
  }

async function showHoldersGraph(tokensMinted) {

  // Holds top wallets data
  var tokenHolders = await getTokenHolders();

  // Used for total wallet count representation
  var wallets = await getWallets();
  $('.wallets').text(  wallets.holdersCount);

  generateHoldersGraph(tokenHolders, tokensMinted);
}

function isExchange(address) {

  // Add exchanges here
  var exchanges = [
  {
    address:'0x8d12a197cb00d4747a1fe03395095ce2a5cc6819',
    name: 'ForkDelta'
  }
];

  for(var i = 0; i < exchanges.length; i++) {
    if(address == exchanges[i].address) {
      return exchanges[i].name;
    }
  }

  return 'Wallet';
}

module.exports.showHoldersGraph = showHoldersGraph;
