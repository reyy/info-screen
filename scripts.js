var tmonth=new Array("JAN","FEB","MAR","APR","May","JUN","JUL","AUG","SEPT","OCT","NOV","DEC");

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

window.onload=function(){
	GetClock();
	setInterval(GetClock,1000);
}