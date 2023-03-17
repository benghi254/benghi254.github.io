windoew.onscroll = function() {scroller()};

var navbar = document.getElementById("navbar");

var sticky = navbar.offsetTop;

function scroller(){
	if (window.pageYOffset >= sticky){
		navbar.classList.add("sticky");
	}else{
		navbar.classList.remove("sticky");
	}
}