		
$(function(){
var BookData = null;
	var BookItem = null ;
 var subject  = null ;
 var PriceMin = null;
 var PriceMax = null;
	var shoppingItemList ;
	//RemoveCookie()
	if(typeof($.cookie("shoppingCartItem")) == 'undefined'){
		shoppingItemList = [] ;
		
	}
	
	else{
		shoppingItemList = JSON.parse($.cookie("shoppingCartItem"))
	}
	console.log(shoppingItemList)
	updateBadge()
	function updateBadge(){
		$(".top-header .badge ").text(shoppingItemList.length)
	}
/*	
	
	var x = function(array , key , valye){
		
		return array.filter(function(obj){
			return obj[key] === value
		});
		
	}
	
	*/
	
 var ID = null;
// Id 
// Title
// Price
// Qty
	$.ajax({
		url:"XML/BookList.xml",
		success:function(data){
		   BookData = data ;
			  BookItem = $(BookData).find("book")
			if(window.location.href.toLowerCase().indexOf("details") == -1){
			  createBookList(1);
			  cratePageItem();
			  AddSubjectMenu();
			  setPriceRange();
			}
			else{
				    showBook()
			}
	},
		error:function(){
			console.log("Ajax Error!")

		}
		
	});








 function filterItem(){
	   BookItem = $(BookData).find("book").filter(function(index){
								
					     var filterFlag = true ;
					     if(subject != null){
											filterFlag = $(this).find("subject").text().trim() == subject && filterFlag 
//											console.log(filterFlag);
										}
					
					
					     if(PriceMin != null){
											  filterFlag = Number($(this).find("price").text()) >  PriceMin && filterFlag
											  console.log(filterFlag);
										}
					     if(PriceMax != null){
											  filterFlag = Number($(this).find("price").text()) < PriceMax && filterFlag 
										}
					
					     return filterFlag ;
								
							});
	
	
	      
			    createBookList(1)
			    cratePageItem()
	
//	     s
	      //alert($("[data-bookCount] small i").html())
	      $("[data-bookCount]  .bookCounter").html(BookItem.length)
	      
}



	function setPriceRange(){
		var Min ;
		var Max ;
		   var priceList = $(BookItem).find("price")
					
		
		  $.each(priceList,function(indexPrice,elementPrice){
						if(Number($(elementPrice).text()) > Max || typeof(Max) == 'undefined' ){
							Max = Number($(elementPrice).text())
						}
						
						if(Number($(elementPrice).text()) < Min || typeof(Min)== 'undefined' ){
							Min = Number($(elementPrice).text())
						}
					});

		     var priceRangeItem = $(".js-range-slider").data("ionRangeSlider");
				
			    priceRangeItem.update({
        type: "double",
        min: Min,
        max: Max,
        from: Min,
        to: Max  ,
        grid: true,
				    skin: "big",
    });
		
		
		
		    //console.log(Min + ":" + Max);
	}
	
	
	
	
	function setPage(pageNo){
		createBookList(pageNo)
		$(".pageBlock ul.pagination li.page-item.active").removeClass("active")
	 $(".pageBlock ul.pagination li.page-item").eq(pageNo).addClass("active")
		
		    $("body , html").animate({
							scrollTop:0,
							
						
						},1000 , function(){
							
						});
		if(pageNo ==1){
			$(".pageBlock ul.pagination li.page-item a[aria-label='Previous']").parent().addClass("disabled").css("cursor","not-allowed")
		}else{
			$(".pageBlock ul.pagination li.page-item a[aria-label='Previous']").parent().removeClass("disabled").css("cursor","pointer");
		}
		
		if(pageNo == Math.ceil($(BookItem).length/9)){
				$(".pageBlock ul.pagination li.page-item a[aria-label='Next']").parent().addClass("disabled").css("cursor","not-allowed")
		}else{
			$(".pageBlock ul.pagination li.page-item a[aria-label='Next']").parent().removeClass("disabled").css("cursor","pointer")
		}
		
		
		
	}
	
	
	 function createBookList(pageCurrentNo){
			
			
			$(".bookShowList").html("")

		
			var MaxNoItem = ((pageCurrentNo) * 9 > $(BookItem).length) ? $(BookItem).length : (pageCurrentNo) * 9
			
			   for(bookIndex=(pageCurrentNo - 1) * 9;bookIndex < MaxNoItem ; bookIndex++){
							 if(bookIndex % 3 == 0){
									$(".bookShowList").append("<div class='card-deck'></div>")
								}
							
							$(".bookShowList .card-deck").last().append("<div class='card  my-2'><img src='#' class='card-img-top' alt=''/><div class='card-body'><h6 class='card-title text-center text-muted'>Card Title </h6></div><div class='card-footer text-center text-muted'> <small class='text-danger'>قیمت :</small> <small class='price'></small></div><div class='card-footer text-muted'><a href='#'><i class='fas fa-cart-plus float-left'></i></a><a href='#'><i class='fas fa-info float-right'></i></a></div></div>");
							
							$(".bookShowList .card-deck .card img").last().attr("src","bookImage/small/"+$(BookItem).eq(bookIndex).attr("id")+".jpg").attr("alt",$(BookItem).eq(bookIndex).find("title").text());
							
							$(".bookShowList .card-deck .card .card-title").last().text($(BookItem).eq(bookIndex).find("title").text())
							$(".bookShowList .card-deck .card .card-footer .price").last().text($(BookItem).eq(bookIndex).find("price").text() )
							
							$(".bookShowList .card-deck .card .card-footer .fa-info").last().parent().attr("href","details.html?id="+$(BookItem).eq(bookIndex).attr("id"));
							
							$(".bookShowList .card-deck .card .card-footer .fa-cart-plus").last().attr("data-id",$(BookItem).eq(bookIndex).attr("id"))
							
						}
			
			  if(MaxNoItem % 3 != 0){
			   for(ExtraCard=0;ExtraCard < 3 - (MaxNoItem % 3) ; ExtraCard++){
							$(".bookShowList .card-deck").last().append("<div class='card my-2 border-0'></div>")
						}
					}
			
			
			
			
		}
	
	$(".fa-cart-plus").click(function(){
				
  			addShoppingItem($(this).attr("data-id") , $(this).parent().parent().parent().find(".card-title").text() , $(this).parent().parent().parent().find(".price").text() , 1)

				
				console.log($(this).attr("data-id") )
				
			});
	
	
	function AddSubjectMenu(){
	   var subjectsList = $(BookItem).find("subject");
		
		$(".navbar .subjects").append("<a class='dropdown-item font-weight-bold' href='#'>همه موضوعات</a>")
		
				$.each(subjectsList,function(subjectItemIndex,subjectItem){
					
					if($(".navbar .subjects").html().indexOf('<a class="dropdown-item" href="#">' +$(subjectItem).text().trim()+  '</a>') == -1){ 
					
					   $(".navbar .subjects").append('<a class="dropdown-item" href="#">' +$(subjectItem).text().trim()+  '</a>')
				}
			
				});		
		
		$(".navbar .subjects a").click(function(){
			    selectedSubject = $(this).text().trim()
			    if(selectedSubject.indexOf("همه موضوعات") == -1){
								subject = selectedSubject ;
			       filterItem()
							}
			else{
				
				subject = null ;
				filterItem()
				   

//				
//				    createBookList(1)
//			     cratePageItem()
			}
			 setPriceRange();
			
			
		});
			
	}


	
	 function cratePageItem(){
			 var pageNo = Math.ceil(BookItem.length / 9) ;
			
			 $(".pageBlock ul li.page-item a.page-link:not([aria-label])").parent().remove()
			
			for(pageItemNo=1;pageItemNo <= pageNo;pageItemNo++){
			$(".pageBlock ul.pagination li ").last().before('<li class="page-item"><a href="#" target="" class="page-link">'+pageItemNo+'</a></li>')
			}
			
			 $(".pageBlock ul li.page-item a").not("[aria-label]").parent().first().addClass("active")
			
			$(".pageBlock ul.pagination li.page-item a[aria-label='Previous']").parent().addClass("disabled").css("cursor","not-allowed")
			
			 $(".pageBlock ul.pagination li.page-item a.page-link").not("[aria-label]").click(function(){
						
					    setPage(Number($(this).text()))
				});
			
			
			$(".pageBlock ul.pagination li.page-item a.page-link[aria-label='Previous']").click(function(){
				  
				     var  prevPage =  Number($(".pageBlock ul li.page-item.active").text()) - 1
								
				     setPage(prevPage)
			});
			
			
						$(".pageBlock ul.pagination li.page-item a.page-link[aria-label='Next']").click(function(){
				  
				     var  NextPage =  Number($(".pageBlock ul li.page-item.active").text()) + 1
								
				     setPage(NextPage)
			});
			

			
			
			
		}
	
			


function showBook(){
	  				    
//				  $("body").append("<p>درون صقحه details هستیمس</p>")
				    ID = window.location.href.split("?")[1].split("=")[1]
				
				    BookSelectedItem = $(BookData).find("book[id='"+ID+"']");
//				    console.log(BookSelectedItem)
	       $(".productItem img").attr("src","bookImage/medium/"+ID+".jpg").attr("data-zoom-image","bookImage/large/"+ID+".jpg")
	
	
	       $("img[data-zoom-image]").elevateZoom({
									  zoomType: "inner",
           cursor: "crosshair"
								});
	
	
	$("[data-name]").each(function(indexItem,elementItem){
		
		     var dataName = $(elementItem).attr("data-name")
		     $(this).text($(BookSelectedItem).find(dataName).text().trim())
	});
	
	$("[data-list]").each(function(indexItem,elementItem){
		  
		$(this).append("<ul class='list-unstyled m-0 p-0' ></ul>")
		var ParentItem = $(this);
		
		
		
		
		$(BookSelectedItem).find($(this).attr("data-list")).children().each(function(indexListItem,elementListItem){
			
			if($(elementListItem).text().trim()){
			  $(ParentItem).children("ul").append("<li>"+$(elementListItem).text().trim()+"</li>")
			}
			else{
				$(ParentItem).children("ul").append("<li><small class='text-danger'>ندارد</small></li>")
			}
		})
	})

	
}
		

	function addShoppingItem(_Id,Title,Price,Qty){
		
		var findIndex = -1 ;
		
		var findItem = shoppingItemList.filter(function(i,n){
			findIndex = n ;
			return i.ID = _Id
		});
		if(findItem.length == 0){
				
		
		shoppingObject = new Object();
				   shoppingObject.ID = _Id; 
				   shoppingObject.Title = Title ; 
				   shoppingObject.price = Price ; 
				   shoppingObject.Qty = Qty ; 
				   shoppingItemList.push(shoppingObject);
				  	updateBadge();
		}else{
			shoppingItemList[findIndex].Qty =  Number(shoppingItemList[findIndex].Qty) + Number(Qty) 
			    
		//	console.log(findItem.Qty)
		}
		//console.log(shoppingItemList)
				  
				   $.cookie("shoppingCartItem",JSON.stringify(shoppingItemList),{expires:1}) 
		
	}
	
	function RemoveCookie(){
		$.removeCookie("shoppingCartItem")
	}



			$(".basket").click(function(){
				
				   addShoppingItem(ID,$("[data-name = 'title']").text(),$("[data-name = 'price']").text(),$("[name='Qty']").val())
				   
			})
});
