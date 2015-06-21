var tmonth=new Array("JAN","FEB","MAR","APR","May","JUN","JUL","AUG","SEPT","OCT","NOV","DEC");
var images=new Array("https://rc4.sg/img/bkg1.jpg","https://rc4.sg/img/bkg3.jpg","https://graphipaintartographer.files.wordpress.com/2011/08/3508-11jmg-blws-posters-landscape-2-2-small.jpg");
var curImage = 0;

moment.locale('en', {
    relativeTime : {
        future: "in %s",
        s:  "Arr",
        m:  "1 min",
        mm: "%d mins"
    }
});

function GetClock(){
	var d=new Date();
	var nmonth=d.getMonth(),ndate=d.getDate(),nyear=d.getYear();
	if(nyear<1000) nyear+=1900;

	var d=new Date();
	var nhour=d.getHours(),nmin=d.getMinutes(),nsec=d.getSeconds();
	if(nmin<=9) nmin="0"+nmin
	if(nsec<=9) nsec="0"+nsec;

	document.getElementById('clockbox').innerHTML=""+ndate+" "+tmonth[nmonth]+"<br>"+nhour+":"+nmin+":"+nsec+"";
}

function loadNextImage(){
	$('#curImage').fadeOut(500, loadNextImageCompleted);
}

function loadNextImageCompleted(){
	if(++curImage >= images.length)
		curImage = 0;

	$('#curImage')[0].src=images[curImage];
	$('#curImage').fadeIn(500);
}

function getBusTiming(){
  $.ajax({
    url: 'https://query.yahooapis.com/v1/public/yql',
    data: {
        q: "select * from json where url ='https://myaces.nus.edu.sg/prjbus/services/shuttlebus/UTOWN'",
        format: "json"
    },
    dataType: "jsonp",
    success: function (data) {
        isb = data.query.results.json.shuttles;
        for(var i=0; i<isb.length; i++) {
	        if(isb[i].name=="D1 (UTown)") {
	            if(isb[i].arrivalTime != "Arr" && isb[i].arrivalTime != "-")
	            	$('#rc4_d1').html(isb[i].arrivalTime + " mins");
	            else
	            	$('#rc4_d1').html(isb[i].arrivalTime);
	        }
	        else if (isb[i].name=="D2") {
	        	if(isb[i].arrivalTime != "Arr" && isb[i].arrivalTime != "-")
	            	$('#rc4_d2').html(isb[i].arrivalTime + " mins");
	            else
	            	$('#rc4_d2').html(isb[i].arrivalTime);
	        }
	    }
        
    }
});

  $.ajax({
    url: 'https://arrivelah.herokuapp.com/?id=19059',
    dataType: "json",
    success: function (data) {
        //console.log(JSON.stringify(data));
        lta = data.services;
        for(var i=0; i<lta.length; i++)
        { 
        	if(lta[i].no == "33")
            	$('#lta_33').html(moment(lta[i]["next"]["time"]).fromNow(true));
            else if(lta[i].no == "196")
            	$('#lta_196').html(moment(lta[i]["next"]["time"]).fromNow(true));
          //lta[i]["subsequent"]["time"] = moment(lta[i]["subsequent"]["time"]).fromNow(true);
        }
    }
});

    $.ajax({
    url: 'https://arrivelah.herokuapp.com/?id=19051',
    dataType: "json",
    success: function (data) {
        //console.log(JSON.stringify(data));
        lta = data.services;
        for(var i=0; i<lta.length; i++)
        { 
            if(lta[i].no == "33")
            	$('#lta_opp_33').html(moment(lta[i]["next"]["time"]).fromNow(true));
            else if(lta[i].no == "196")
            	$('#lta_opp_196').html(moment(lta[i]["next"]["time"]).fromNow(true));
        }
        
    }
});
}

window.onload=function(){
	GetClock();
	getBusTiming();
	loadNextImageCompleted();
	setInterval(GetClock,1000);
	setInterval(loadNextImage,6000);
	setInterval(getBusTiming,30000);
}