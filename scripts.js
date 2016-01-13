var rssurl = "http://www.channelnewsasia.com/starterkit/servlet/cna/rss/singapore.xml";
var tmonth=new Array("JAN","FEB","MAR","APR","May","JUN","JUL","AUG","SEPT","OCT","NOV","DEC");
var posterList=new Array("transparent.png");
var curImage = 0;
var messageCombined = "Welcome to Residential College 4! &nbsp";
var newsCombined = "";

moment.locale('en', {
    relativeTime : {
        future: "in %s",
        s:  "Arr",
        m:  "1 min",
        mm: "%d mins"
    },
    invalidDate: "-"
});

function getNews(){
    $.get(rssurl, function(data) {
        newsCombined = "";

        var $xml = $(data);
        $xml.find("item").each(function() {
            var $this = $(this),
                item = {
                    title: $this.find("title").text(),
                    description: $this.find("description").text()
                }
                //Ignore feed description (for now)
                newsCombined += '&nbsp <i class="fa fa-newspaper-o"></i> &nbsp';
                newsCombined+='&nbsp' + item.title + '&nbsp';
        });

        $('#scroller').html(messageCombined + newsCombined);
    });

}

function getClock(){
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
	if(++curImage >= posterList.length)
		curImage = 0;

	$('#curImage')[0].src=posterList[curImage];
	$('#curImage').fadeIn(500);
}

function getBusTiming(){
  //Requires the '--disable-web-security' flag in chrome
  $.ajax({
    url: 'https://nextbus.comfortdelgro.com.sg/eventservice.svc/Shuttleservice?busstopname=UTOWN',
    dataType: "json",
    success: function (data) {
        isb = data.ShuttleServiceResult.shuttles;
        for(var i=0; i<isb.length; i++) {
	        if(isb[i].name=="D1(To UTown)") {
	            if(isb[i].arrivalTime == "N.A")
	            	$('#rc4_d1').html("-");
	            else if(isb[i].arrivalTime != "Arr" && isb[i].arrivalTime != "-")
	            	$('#rc4_d1').html(isb[i].arrivalTime + " mins");
	            else
	            	$('#rc4_d1').html(isb[i].arrivalTime);
	        }
	        else if (isb[i].name=="D2(To UTown)") {
	            if(isb[i].arrivalTime == "N.A")
	            	$('#rc4_d2').html("-");
	            else if(isb[i].arrivalTime != "Arr" && isb[i].arrivalTime != "-")
	            	$('#rc4_d2').html(isb[i].arrivalTime + " mins");
	            else
	            	$('#rc4_d2').html(isb[i].arrivalTime);
	        }
	    }
        
    }
});

  $.ajax({
    url: 'http://arrivelah.herokuapp.com/?id=19059',
    dataType: "json",
    success: function (data) {
        //console.log(JSON.stringify(data));
        lta = data.services;
        for(var i=0; i<lta.length; i++)
        { 
        	var res = "-";
        	if(lta[i]["next"]["duration_ms"] == null)
        		res = "-";
        	else 
        	{
			res = Math.floor((lta[i]["next"]["duration_ms"]/ 1000) / 60);
			if(res < 1)
				res = "Arr";
			else
				res = res  + " mins";
        	}

        	if(lta[i].no == "33")
            		$('#lta_33').html(res);
            	else if(lta[i].no == "196")
            		$('#lta_196').html(res);
          //lta[i]["subsequent"]["time"] = moment(lta[i]["subsequent"]["time"]).fromNow(true);
        }
    }
});

    $.ajax({
    url: 'http://arrivelah.herokuapp.com/?id=19051',
    dataType: "json",
    success: function (data) {
        //console.log(JSON.stringify(data));
        lta = data.services;
        for(var i=0; i<lta.length; i++)
        { 
        	var res = "-";
        	if(lta[i]["next"]["duration_ms"] == null)
        		res = "-";
        	else 
        	{
			res = Math.floor((lta[i]["next"]["duration_ms"]/ 1000) / 60);
			if(res < 1)
				res = "Arr";
			else
				res = res  + " mins";
        	}

            if(lta[i].no == "33")
            	$('#lta_opp_33').html(res);
            else if(lta[i].no == "196")
            	$('#lta_opp_196').html(res);
        }
        
    }
});
}

function loadImageList(){
	$.ajax({
    url: 'https://spreadsheets.google.com/feeds/list/1vwEDjW19YoJZmRTDVsRCMGysjePw81ls8CSe90NeRCA/1/public/values?alt=json',
    dataType: "jsonp",
    success: function (data) {
    	posterList = new Array();

        for(var i=0; i<data.feed.entry.length; i++)
        {
            if(data.feed.entry[i]['gsx$approved']['$t'] == "Y" && 
                (data.feed.entry[i]['gsx$startdate']['$t'] == "" || moment(data.feed.entry[i]['gsx$startdate']['$t'], "MM/DD/YYYY").isBefore()) && 
                (data.feed.entry[i]['gsx$enddate']['$t'] == "" || moment(data.feed.entry[i]['gsx$enddate']['$t']+ "23:59", "MM/DD/YYYY HH:mm").isAfter()))
                posterList[posterList.length]=data.feed.entry[i]['gsx$posterurl']['$t'];
        }
    }
        
    });
}

function loadMessageList(){
	$.ajax({
    url: 'https://spreadsheets.google.com/feeds/list/1dRpDWAt6YZbJgnhYKuAb4YL2QkEZlKjiGMwEKnjolbU/1/public/values?alt=json',
    dataType: "jsonp",
    success: function (data) {

        for(var i=0; i<data.feed.entry.length; i++)
        {
            if(data.feed.entry[i]['gsx$approved']['$t'] == "Y" && 
                (data.feed.entry[i]['gsx$startdate']['$t'] == "" || moment(data.feed.entry[i]['gsx$startdate']['$t'], "MM/DD/YYYY").isBefore()) && 
                (data.feed.entry[i]['gsx$enddate']['$t'] == "" || moment(data.feed.entry[i]['gsx$enddate']['$t']+ "23:59", "MM/DD/YYYY HH:mm").isAfter()))
            {
            	if(data.feed.entry[i]['gsx$messagetype']['$t'] == "Announcement")
            		messageCombined += '&nbsp <i class="fa fa-bullhorn"></i> &nbsp';
            	else if(data.feed.entry[i]['gsx$messagetype']['$t'] == "Birthday Wishes")
            		messageCombined += '&nbsp <i class="fa fa-birthday-cake"></i> &nbsp';

            	messageCombined+='&nbsp' + data.feed.entry[i]['gsx$message']['$t'] + '&nbsp';
            }
        }
        $('#scroller').html(messageCombined + newsCombined);
    }
        
    });
}

window.onload=function(){
	loadImageList();
	getClock();
	getBusTiming();
    getNews();
	loadMessageList();
	loadNextImageCompleted();
	setInterval(getClock,1000);
	setInterval(loadNextImage,6000);
	setInterval(getBusTiming,15000);
    setInterval(getNews,3*60*60*1000); //Every 3 hours
}
