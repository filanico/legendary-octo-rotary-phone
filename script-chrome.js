//////////// CONFIGURAZIONE ///////////////////////////////////////////////////
// const adesso = new Date();
// const adessoAsString = `${adesso.getFullYear()}-${adesso.getMonth()+1}-${adesso.getDate()}`;
const checkEveryMsecs=4000;
const rate = 0.5;
const payload  = {
  asc: "desc",
  league: "all",
  playing_status: "all",
  position: "all",
  scarcity: "all",
  order: "endingAt",
  bmp: true,
  gw: 0,
  limit: 20,
  max_price: -1,
  min_price: -1,
  offset: 0,
  teams: [],
  u23: false,
  watchlist: false
};
////////////////////////////////////////////////////////////////////////////////

const delay = async(msecs)=>new Promise((res,rej)=>{setTimeout(()=>{res();},msecs)});


(async()=>{
	// return;
	while(true){
		var adesso = new Date();
		var adessoAsString = `[${adesso.getFullYear()}-${adesso.getMonth()+1}-${adesso.getDate()} ${adesso.getHours()}:${adesso.getMinutes().toString().padStart(2,0)}:${adesso.getSeconds().toString().padStart(2,0)}]`;
		var resp = await fetch("https://www.soraredata.com/api/offers/ongoingOffers", {
			"credentials": "omit",
			"headers": {
				"User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:94.0) Gecko/20100101 Firefox/94.0",
				"Accept": "application/json, text/plain, /",
				"Accept-Language": "en-US,en;q=0.5",
				"Content-Type": "application/json",
				"Alt-Used": "www.soraredata.com",
				"Pragma": "no-cache",
				"Cache-Control": "no-cache",
				"Sec-Fetch-Dest": "empty",
				"Sec-Fetch-Mode": "cors",
				"Sec-Fetch-Site": "same-origin"
			},
			"Referer": "https://www.soraredata.com/publicOffers",
			"body": JSON.stringify(payload),
			"method": "POST",
			"mode": "cors"
			}
		); 
		// console.log("FATTO");
		resp = await resp.json();
		var data = resp
			.offers
			.filter( o => (o.bmp-o.offer.ReceiveAmountInWei)/o.offer.ReceiveAmountInWei >= rate )
			.map( o => {
				var _rate = (o.bmp-o.offer.ReceiveAmountInWei)/o.offer.ReceiveAmountInWei;
				var _extraInfo = o.bmp == o.offer.ReceiveAmountInWei ? '' : `(bmp:${o.bmp} ReceiveAmountInWei${o.offer.ReceiveAmountInWei})`;
				return `${adessoAsString} ${o.player.DisplayName} ${_extraInfo}`;
			})
		;
		if( data.length == 0 )
			data = ['Niente :('];
		console.log( data.join("\n") );
		// console.log( resp.offers );
		await delay(checkEveryMsecs);
	}
})(); 