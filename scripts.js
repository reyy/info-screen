var tmonth=new Array("JAN","FEB","MAR","APR","May","JUN","JUL","AUG","SEPT","OCT","NOV","DEC");
var images=new Array("transparent.png");
var curImage = 0;

moment.locale('en', {
    relativeTime : {
        future: "in %s",
        s:  "Arr",
        m:  "1 min",
        mm: "%d mins"
    },
    invalidDate: "-"
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
    url: 'http://cors.io/?u=https://myaces.nus.edu.sg/prjbus/services/shuttlebus/UTOWN',
    dataType: "json",
    success: function (data) {
        isb = data.shuttles;
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

function loadImageList(){
	$.ajax({
    url: 'https://spreadsheets.google.com/feeds/list/1vwEDjW19YoJZmRTDVsRCMGysjePw81ls8CSe90NeRCA/1/public/values?alt=json',
    dataType: "jsonp",
    success: function (data) {
    	images = new Array();
    	
        for(var i=0; i<data.feed.entry.length; i++)
        {
        	//Todo: Fix issues with start/expiry checks
            if(data.feed.entry[i]['gsx$approved']['$t'] == "Y" /*&& 
            	(data.feed.entry[i]['gsx$startdate']['$t'] == "" || moment(data.feed.entry[0]['gsx$startdate']['$t']).isAfter()) && 
            	(data.feed.entry[i]['gsx$enddate']['$t'] == "" || moment(data.feed.entry[0]['gsx$enddate']['$t']).isBefore())*/)
            	images[images.length]=data.feed.entry[i]['gsx$posterurl']['$t'];
        }
    }
        
    });
}

window.onload=function(){
	loadImageList();
	GetClock();
	getBusTiming();
	loadNextImageCompleted();
	setInterval(GetClock,1000);
	setInterval(loadNextImage,6000);
	setInterval(getBusTiming,30000);
}