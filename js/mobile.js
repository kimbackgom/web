$(function () {

	var ellipsis = function (con, c) {
		con.each(function () {
			var length = c;
			$(this).each(function () {
				if ($(this).text().length >= length) {
					$(this).text($(this).text().substr(0, length) + ' ...')
				}
			});
		});
	}
	ellipsis($(".sns .board_con .txt2"), 45);
	ellipsis($(".report .board_con p"), 60);

	var nav_on = '<i class="fa fa-bars" aria-hidden="true"></i>';
	var nav_off = '<i class="fa fa-times" aria-hidden="true"></i>';



	$(document).ready(function () {
		$(".m_nav_btn").click(function () {
			if (!$(this).hasClass("on")) {
				$(this).addClass("on");
				$(this).html(nav_off)
				$('html, body').addClass('hidden');
				$(".main_nav").fadeIn();
			} else {
				$('html, body').removeClass('hidden');
				$(this).removeClass("on")
				$(this).html(nav_on)
				$(".main_nav").fadeOut();
			}
		});

		$(".accordion_menu>li>a").click(function(){
			if (!$(this).hasClass("on")) {
				var lt = $(this).siblings(".board_con_wrap").children(".board_con").length
				var h = $(this).siblings(".board_con_wrap").children(".board_con").outerHeight() * lt
				$('.accordion_menu>li>a').each(function () {
					$(this).removeClass("on");
				});
				$('.board_con_wrap').each(function () {
					$(this).css("height","0");
				});
				$(this).addClass("on");
				$(this).siblings(".board_con_wrap").animate({
					height: h
				},200);
			}else{
				$(this).removeClass("on");
				$(this).siblings(".board_con_wrap").animate({
					height: 0
				}, 200);
			}
		});
	})
	 
	 
	
})



