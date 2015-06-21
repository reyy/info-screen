var tmonth=new Array("JAN","FEB","MAR","APR","May","JUN","JUL","AUG","SEPT","OCT","NOV","DEC");
var images=new Array("https://rc4.sg/img/bkg1.jpg","https://rc4.sg/img/bkg3.jpg","https://graphipaintartographer.files.wordpress.com/2011/08/3508-11jmg-blws-posters-landscape-2-2-small.jpg");
var curImage = 0;

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

window.onload=function(){
	GetClock();
	loadNextImageCompleted();
	setInterval(GetClock,1000);
	setInterval(loadNextImage,6000);
}