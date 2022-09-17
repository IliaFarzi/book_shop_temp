$(document).ready(function(){
	let BookData = null , page =1 , books = null ,sliderUpdate = false , slectedBook = null ,rawData = null , cartCookie =[];
	// reading cookie
	if($.cookie('cart') == undefined){
		cartCookie = []
	}else {
		$(JSON.parse($.cookie('cart'))).each(function (index , item) {
			cartCookie.push(item)
		})
	}
	$.ajax({
		url:"Xml/BookList.xml" ,
		success:function(data){
			  BookData = $(data).find("book")
			  books = BookData
			  rawData = data
			// central func
			master()

		},
		error:function(){
			alert("Error Sending Ajax Request!")
		}
	});
	//master
	function master() {
		nav()
		homePage()
	}
	//temp
	function nav() {
		// call other func
		badge(cartCookie.length)
		// vars
		let subject = $(books).find('subject') ,pureText=null,text=null
		// function starts here
		$(".dropdown-menu").append("<a class='dropdown-item font-weight-bold'>همه موضوعات</a><div class='dropdown-divider'></div>")
		$(subject).each(function (index , item) {
			text = $(item).text()
			pureText=text.trim()
			if($(".dropdown-menu").html().indexOf('<a class="dropdown-item">'+pureText+'</a>') == -1) {
				$(".dropdown-menu").append('<a class="dropdown-item">' + pureText + '</a>')
			}
		})
		$(".dropdown-menu .dropdown-item").click(function () {
			text = $(this).text()
			if(text.indexOf("همه موضوعات") == -1){
				books = $(BookData).filter(function () {
					pureText= $(this).find('subject').text()
					return text == pureText.trim()
				})}else {

				books =BookData
			}
			page=1
			priceFilter(books)
		})
		$(".navbar-collapse .home-page").click(function (_event) {
			sliderUpdate = false
			homePage()
		})
	}


	//pages
	function homePage() {
		//bug fix
		bug_0()
		// background
		$("#main").html(`<div class="row">
    <div class="col-4 mt-2">
   <div class="card">
   <div class="card-header bg-jet"><h4 class="text-light text-center">اعمال فیلتر</h4></div>
   </div>
<div class="card-body direction-ltr">
<input type="text" class="js-range-slider" name="my_range" value="" /></div>
 </div>

<div class="col-8">
   <div class="card border-0">
    <section class="bookShowList"></section>
  </div>
<div>
<ul class="pagination d-flex justify-content-center">
<li class="page-item perv">
<a class="page-link text-dark" href="#" aria-label="Previous">
<span aria-hidden="true">&laquo;</span>
</a>
</li>
<li class="page-item next">
<a class="page-link text-dark" href="#" aria-label="Next">
<span aria-hidden="true">&raquo;</span>
</a>
</li>
</ul>
</div>
 </div>
  </div>`)
		// call other func and update
		$(".navbar-collapse .dropdown-toggle").removeClass("disabled")
		priceFilter(books)

	}
	function productPage(_id){
		// update
		$(".navbar-collapse .dropdown-toggle").addClass("disabled")
		// var
		let slectedBookId = null , qty=null
		//background
		$("#main").html(`<div class="row">
        <div class="col-4">
            <div class="card mt-2">
            <div class="card-body">
                <img src="#" alt="" class="img-fluid product-img">
            </div>
        </div>
        </div>
        <div class="col-8 discription"></div>
    </div>`)
		// function starts here
		slectedBookId = _id
		slectedBook = $(rawData).find("book[id='"+slectedBookId+"']")
		$(".product-img").attr("src" , "BookImage/medium/"+slectedBookId+".jpg").attr("data-zoom-image","BookImage/large/"+slectedBookId+".jpg").elevateZoom({
			zoomType:"inner",
			cursor:"crosshair"
		})
		$(".discription").append(`
		<dl class="row mt-4">
		<dt class="col-3 text-right my-1 bg-light py-2 text-muted">نام کتاب</dt>
		<dd class="col-9 text-right my-1 bg-light py-2 ">${$(slectedBook).find("title").text()}</dd>

		<dt class="col-3 text-right my-1 bg-light py-2 text-muted">سال انتشار</dt>
		<dd class="col-9 text-right my-1 bg-light py-2 ">${$(slectedBook).find("publishyear").text()}</dd>

		<dt class="col-3 text-right my-1 bg-light py-2 text-muted">موضوع</dt>
		<dd class="col-9 text-right my-1 bg-light py-2 ">${$(slectedBook).find("subject").text()}</dd>
		
		<dt class="col-3 text-right my-1 bg-light py-2 text-muted">قیمت</dt>
		<dd class="col-9 text-right my-1 bg-light py-2 ">${$(slectedBook).find("price").text()}</dd>

		<dt class="col-3 text-right my-1 bg-light py-2 text-muted">ناشر</dt>
		<dd class="col-9 text-right my-1 bg-light py-2 ">${$(slectedBook).find("publisher").text()}</dd>
		
		<dt class="col-3 text-right my-1 bg-light py-2 text-muted">نویسندگان</dt>
		<dd class="col-9 text-right my-1 bg-light py-2 "><ul class="list-unstyled" id="author"></ul></dd>
		
		<dt class="col-3 text-right my-1 bg-light py-2 text-muted">مترجمین</dt>
		<dd class="col-9 text-right my-1 bg-light py-2 "><ul class="list-unstyled" id="translator"></ul></dd>
</dl>
<h5 class="row text-primary" style="font-size: 1.5rem"><i class="fa fa-book-reader mx-1"></i>در این کتاب خواهید خواند:</h5>
<div class="row text-right text-muted mb-2 p-2 bg-light" style="line-height: 30px;">${$(slectedBook).find("description").text()}</div>
<h5 class="row text-primary " style="font-size: 1.5rem;"><i class="fa fa-calendar-check mx-1"></i>الان بخرید</h5>
<div class="row bg-light py-3 px-2">
<div class="input-group bg-light text-right">
<div class="input-group-append">
<button class="btn btn-outline-dark add-to-cart" style="border-bottom-right-radius: 3px; border-top-right-radius: 3px;" data-toggle="tooltip" data-placement="top" title="افزودن به سبد"><span class="fa fa-shopping-cart"></span></button>
</div>
<input type="text" class="form-control qty" placeholder="تعداد" style="max-width: 150px!important;;">


</div>
</div>
		`)
		$("dd ul.list-unstyled").each(function (index , item)  {
			$(slectedBook).find(item.id).each(function (_index,_item) {
				$(item).append(`<li>${$(_item).text()}</li>`)
			})
		})
		$("[data-toggle ='tooltip']").tooltip()
		$(".add-to-cart").click(function (_event) {
			movingUpAnimate(_event)
			qty = ($(".qty").val() == "" ) ? '1' : $(".qty").val();
			addToCart(slectedBookId , qty)
		})
	}
	function purchase() {
		
	}


	//homePage func
	function pagination(_book) {
		//update
		$(".pagination .number").remove()
		//var
		let pageNo = $(_book).length
		//func start here
		pageNo = Math.ceil(pageNo/9)
		for(let i = 1 ; i<= pageNo ; i++){
			$('.pagination li').last().before(`<li class="page-item number"><a href="#" class="page-link text-dark">${i}</a></li>`)
		}
		$(".pagination .page-item.number").click(function (_event) {
			movingUpAnimate(_event)
			$('.bookShowList').html("")
			page = Number($(this).text())
			createBookList(page , _book)
		})
		$(".pagination .page-item.next").click(function (_event) {
			movingUpAnimate(_event)
			if (page < pageNo) {
				$('.bookShowList').html("")
				page++;
				createBookList(page,_book)
			}
		})
		$(".pagination .page-item.perv").click(function (_event) {
			movingUpAnimate(_event)
			if(page > 1) {
				$('.bookShowList').html("")
				page--;
				createBookList(page,_book)
			}
		})
	}
	function createBookList(_currunt,_book){
		//update
		$(".bookShowList .card-deck").remove()
		//vars
		let limit = (_currunt*9 > $(_book).length) ? $(_book).length : _currunt*9;
		//func starts here
		if(_currunt === 1){
			$(".pagination .perv").addClass("display-non")
		}else{
			$(".pagination .perv").removeClass("display-non")
		}
		if(_currunt === Math.ceil($(_book).length/9)){
			$(".pagination .next").addClass("display-non")
		}else {
			$(".pagination .next").removeClass("display-non")
		}
		for(let bookIndex = (_currunt-1)*9 ; bookIndex < limit ; bookIndex++) {
			if (bookIndex % 3 === 0) {
				$(".bookShowList").append("<div class='card-deck'></div>")
			}
			$('.pagination .number .page-link').removeClass("bg-jet text-light").addClass("text-dark")
			$(".pagination .number .page-link").eq(_currunt - 1).addClass("bg-jet text-light").removeClass('text-dark')
			$(".bookShowList .card-deck").last().append(`<div class="card my-2 pulse">
				<div class="card-body">
    <img src="#" class="card-img-top" alt="#">
      <h5 class="card-title after-line">Card title</h5>
      <p class="card-text"></p>
      </div>
    <div class="card-footer text-center"><span> قیمت : </span>
    <span class="price"></span></div>

    <div class="card-footer">
      <a href="#" class="text-dark add-to-cart"><i class='fas fa-shopping-cart float-left'></i></a>
      <a href="#" class="text-dark info"><i class='fas fa-info float-right'></i></a>
    </div>
  </div>`);
			$(".bookShowList .info").last().attr("id" , "info_"+$(_book).eq(bookIndex).attr("id")+"")
			$(".bookShowList .add-to-cart").last().attr("id" , "cart_"+$(_book).eq(bookIndex).attr("id")+"")
			$(".bookShowList .card-deck .card img").last().attr("src", "bookImage/medium/" + $(_book).eq(bookIndex).attr("id") + ".jpg").attr('alt', $(_book).eq(bookIndex).find('title').text())
			// yes you can summon two method in one go with jq
			$(".bookShowList .card-deck .card-body h5").last().addClass('text-center text-jet my-3 no-wrap').text($(_book).eq(bookIndex).find('title').text())
			$(".bookShowList .card-deck .card-footer .price").last().html("<span class='text-primary underline'>" + $(_book).eq(bookIndex).find('price').text() + "</span> <span> تومان</span>")
		}
			if(limit % 3 !== 0){
						for (let i =0 ; i< 3-($(_book).length%3) ; i++)
							$(".bookShowList .card-deck").last().append("<div class='card border-0'></div>")
					}
			$(".bookShowList .add-to-cart").click(function (_event) {
				movingUpAnimate(_event)
				let id = $(this).attr("id")
				id= id.split("_")[1]
				addToCart(id)
			})
		   $(".bookShowList .info").click(function (_event) {
			   movingUpAnimate(_event)
			let id = $(this).attr("id")
			id = id.split("_")[1]
			productPage(id)
		})
	}
	function priceFilter(_book) {
		// vars
		let prices = $(_book).find("price") ,slider = $(".js-range-slider").data("ionRangeSlider"), max=null , min=null
		// func start here
		$(prices).each(function (index,item) {
			if(Number($(item).text()) < min || typeof (min) == "object"){
				min = Number($(item).text())
			}
			if(Number($(item).text()) > max || typeof (max) == "object"){
				max = Number($(item).text())
			}
		})
		if(sliderUpdate){
			slider.update({
				max:max,
				min:min,
				from:min,
				to:max,
				onChange:function (data) {
					applyFilter(onChangeFilter(data.from ,data.to , _book))
				}
			})
		}else {
			sliderUpdate = true
		$(".js-range-slider").ionRangeSlider({
			type:"double",
			grid:true,
			max:max,
			min:min,
			from:min,
			to:max,
			skin:"square",
			prettify_enabled:true,
			prettify_separator:",",
			step:1000,
			onChange:function (data) {
				applyFilter(onChangeFilter(data.from , data.to , _book))
			}
		})}
		applyFilter(_book)

		//use apply both on change and in the end of func
	}
	function applyFilter(_book) {
		//update
		pagination(_book)
		page =1
		createBookList(page,_book)
	}
	function onChangeFilter(_min,_max,_book) {
		//var
		let qulifide;
		// func starts here
		_book = $(_book).filter(function () {
			qulifide = Number($(this).find("price").text()) >= _min && Number($(this).find("price").text()) <= _max
			return qulifide
		})
		return _book
	}

	//homePage+productPage func
	//add to cart is cookie updating func
	function addToCart(_id , _qty = 1) {
		//vars
	let dataExport = {} , bookExport = $(rawData).find("#"+_id) , existingBook=null , title = bookExport.find("title").text() , price = bookExport.find("price").text();
	// func starts here
	$(cartCookie).each(function (index,item) {
			if(item.id == _id){
				existingBook = index;
			}
		})
		if(existingBook == null){
		dataExport.id = _id
		dataExport.title = title.trim()
		dataExport.price = Number(price)
		dataExport.qty = Number(_qty)
			cartCookie.push(dataExport)
		}else {
			cartCookie[existingBook].qty += Number(_qty)
		}
		badge(cartCookie.length)
		//cookie update
		$.cookie("cart" , JSON.stringify(cartCookie) ,{ expires: 5 , path:"/"})
	}
	function badge(_qty){
		// func starts here
		if(_qty != 0) {
			$(".cart-badge").text(_qty)
		}
	}

	//tools
	function movingUpAnimate(_event){
		//reset
		_event.preventDefault()
		//func starts here
		$("html,body").animate({scrollTop:0},250)
	}

	//bug fix
	// bug_0 elevaitzoom plugin (out source)
	//zoom container and zoom window container are created out side #main thus will not be cleared after switching back to home page
	function bug_0() {
		//use func in the beginning of homePage()
		$(".zoomWindowContainer , .zoomContainer , #torrent-scanner-popup").remove()

	}
})