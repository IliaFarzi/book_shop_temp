$(function () {

    $("[data-validation-role]").blur(function () {

         if($(this).attr("data-validation").toLowerCase() == "on"){


             $(this).removeClass("is-valid is-invalid")
             var valid = eval($(this).attr("data-validation-role").toLowerCase()+"(this)")
             if(valid === false){
                 // $(this).next(".invalid-feedback").text("plz Fill This Filed ..")
                 $(this).addClass("is-invalid")
             }

            if(valid === true){
                $(this).addClass("is-valid")
            }


         }
    }).after("<div class='invalid-feedback'></div>");


    function required(Item) {

        var val = $(Item).val()

        if(val.length == 0){
            $(Item).next(".invalid-feedback").text("plz Fill This Filed ..")
             return false ;
        }
        else{
            return true ;
        }

    }



    
    
    function validnumber(Item) {

      var val = $(Item).val();


        if(val.length !=0) {
            if (isNaN(val)) {
                $(Item).next(".invalid-feedback").text("plz Enter Valid Age!")
              return false ;
            }
                return true ;


        }
        // else{
        //     $(Item).addClass("is-invalid")
        //     $(Item).next(".invalid-feedback").text("Khali nazar Dooste man")
        // }
    }

})