var productPrices = {};

$(function () {
    //Json data by api call for order table
    $.get(productListApiUrl, function (response) {
        productPrices = {};
        if(response) {
            var options = '<option value="">--Select--</option>';
            $.each(response, function(index, product) {
                options += '<option value="'+ product.products_id +'">'+ product.name +'</option>';
                productPrices[product.products_id] = product.price_per_unit;
            });
            $(".product-box").find("select").empty().html(options);
        }
    });
});

$("#addMoreButton").click(function () {
    var row = $(".product-box").html();
    $(".product-box-extra").append(row);
    $(".product-box-extra .remove-row").last().removeClass('hideit');
    $(".product-box-extra .product-price").last().text('0.0');
    $(".product-box-extra .product-qty").last().val('1');
    $(".product-box-extra .product-total").last().text('0.0');
});

$(document).on("click", ".remove-row", function (){
    $(this).closest('.row').remove();
    calculateValue();
});

$(document).on("change", ".cart-product", function (){
    var products_id = $(this).val();
    var price = productPrices[products_id] || 0;

    $(this).closest('.row').find('#product_price').val(price);
    calculateValue();
});

$(document).on("change", ".product-qty", function (){
    calculateValue();
});

$("#saveOrder").on("click", function(){
    var formData = $("form").serializeArray();
    var requestPayload = {
        customer_name: null,
        grand_total: null,
        order_details: []
    };
    for(var i=0; i<formData.length; ++i) {
        var element = formData[i];
        var lastElement = null;

        switch(element.name) {
            case 'customerName':
                requestPayload.customer_name = element.value;
                break;
            case 'product_grand_total':
                requestPayload.grand_total = element.value;
                break;
            case 'product':
                requestPayload.order_details.push({
                    product_id: element.value,
                    quantity: null,
                    total_price: null
                });                
                break;
            case 'qty':
                lastElement = requestPayload.order_details[requestPayload.order_details.length-1];
                lastElement.quantity = element.value;
                break;
            case 'item_total':
                lastElement = requestPayload.order_details[requestPayload.order_details.length-1];
                lastElement.total_price = element.value;
                break;
        }
    }

    callApi("POST", orderSaveApiUrl, {
        'data': JSON.stringify(requestPayload)
    });
});

// Assuming a function for calculating total values
function calculateValue() {

    var grandTotal = 0;
    $(".row").each(function () {
        var qty = parseFloat($(this).find(".product-qty").val()) || 0;
        var price = parseFloat($(this).find("#product_price").val()) || 0;
        var total = qty * price;

        $(this).find(".product-total").text(total.toFixed(2));
        grandTotal += total;

    });
    $("#grand_total").text(grandTotal.toFixed(2));
}
