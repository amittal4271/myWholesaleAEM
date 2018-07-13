var Frontier = Frontier || {};
Frontier.formEntry =Frontier.formEntry || {};

Frontier.formEntry = new function(){
    function init(){
         var $validFlag = $('#newsletter-form').valid();
        if($validFlag){
            subscribeNewsletter();
        }else{
            enableErrorMsg('error');
        }
        
    }
    
    function subscribeNewsletter(){
        clearErrorMsg();
         $('#formentry-message').css('display','none'); 
        var serverURL = window.serverURL;
        var email = $('#email-input').val();
        getAdminToken().then(function(response){  
           $.support.cors = true;
            $.ajax({
                url: serverURL+"/rest/V1/frontier-newsletter/newsletter/subscribe/"+email,
                type: "GET",
                dataType: "json",
                headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", 
                      "Authorization": response,
                       "Access-Control-Allow-Origin":serverURL,
                        "Access-Control-Allow-Credentials":"true"
                     },
                crossDomain: true,
                timeout: getServiceTimeOut()
            }).done(function(results){
                console.log(results);
                var bReturn = false;
                if($.isArray(results)){
                   if(results[0].subscribed){
                       bReturn = true;
                   }
                  
                }
                if(bReturn){
                     $('#formentry-message').css('display','block');
                       $('#formentry-message').html("Email is Subscribed");
                }else{
                    $('#formentry-message').css('display','block');
                        $('#formentry-message').html("Subscribe Service is not available"); 
                }
               
            }).fail(function(error){
                console.log(error);
                $('#formentry-message').css('display','none'); 
                enableErrorMsg('error');
            });
        });
    }
    $(document).ready(function(){
        validation.newletterForm('#newsletter-form');
        $(document).on('click','#submit-email',function(e){
            e.preventDefault();
           //call api here....
            init();
        });
    });
}();


