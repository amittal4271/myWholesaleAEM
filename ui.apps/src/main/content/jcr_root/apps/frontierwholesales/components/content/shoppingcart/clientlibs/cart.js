$(document).ready(function(){
    
    getCartItem();
    $('.cart-qty-input.form-control').on('change',function(){ 
        var $this = $(this);
        var qty = $this.val();
        updateShoppingCart(qty); 
    });
    
    $(document).on('change','.cart-qty-input',function(){ 
        var $this = $(this);
        var item_id = $this.attr('id');
        var qty = $this.val();
        updateCart(item_id,qty);
        
    });
    
    $(document).on('click', '.btn.btn-only-green-icon', function() {
           console.log('button is clicked...');
         var $this = $(this);
        var itemId = $this.data('itemid');
        var deleteCartItemModal = $('#modalDeleteCartItem');
        var modalRemoveItemButton = deleteCartItemModal.find('.btn-cart-remove-item');
        modalRemoveItemButton.data('itemid', itemId);
    });
    
    $(document).on('click','.btn-cart-remove-item',function(){
       
        var $this = $(this);
        var itemId = $this.data('itemid');
        cartItemRemove(itemId);
    });
    
    $(document).on('click','.btn-cart-checkout',function(){
       window.location=Granite.HTTP.externalize($('#pageURL').data('pageurl')); 
    });
    
});

function updateCart(itemId,qty){
    var jsonData={};
    var cartItems={};
    var cartData={};
    cartItems['qty']=qty;
    showLoadingScreen();
    cartData['cartItem']=cartItems;
    jsonData['itemId']=itemId;
    jsonData['cartItem']=JSON.stringify(cartData);
    jsonData['action']='update';
    $.ajax({
        url:"/services/cart",
        data:jsonData,
         headers:{

                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization':getUserToken()
            },
      beforeSend:function(xhr){
          xhr.overrideMimeType("application/json");
      }
    }).done(function(result){
         hideLoadingScreen();
       console.log(result); 
    }).fail(function(error){
         hideLoadingScreen();
        console.log(error);
        enableErrorMsg();
    });
}



function getCartItem(){
    showLoadingScreen();
    var jsonData={};
    jsonData['action']='getCart';
     $.ajax({
       url: "/services/cart" ,
        method: "get",
         data:jsonData,
        headers:{

                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization':getUserToken()
            },
      beforeSend:function(xhr){
          xhr.overrideMimeType("application/json");
      }
        
    }).done(function(cart){
         hideLoadingScreen();
        
        var template = $("#cartTemplate").html();
         var processedHTML = Handlebars.compile(template);
        var html = processedHTML(cart);
        $('#carttemplate').html(html);
         
    }).fail(function(error){
         console.log("error");
         hideLoadingScreen();
             var template = $("#carttemplate").html();
            var processedHTML =  Handlebars.compile(template);
			var html = processedHTML('');
            $('#carttemplate').html(html); 
     });
}



function cartItemRemove(itemId){
   
     var jsonData={};
   
    jsonData['itemId']=itemId;
    jsonData['action']='remove';
    $.ajax({
       url: "/services/cart",
        method: "get",
        data:jsonData,
         headers:{

                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization':getUserToken()
            },
      beforeSend:function(xhr){
          xhr.overrideMimeType("application/json");
      }
        
    }).done(function(cart){
        
        $('#modalDeleteCartItem').modal('hide');
      
        var template = $("#cartTemplate").html();
        var processedHTML = Handlebars.compile(template);
        var html = processedHTML(cart);
        $('#carttemplate').html(html);
         
    }).fail(function(error){
         console.log("error");
             var template = $("#cartTemplate").html();
            var processedHTML =  Handlebars.compile(template);
			var html = processedHTML('');
            $('#carttemplate').html(html); 
     });
   
}