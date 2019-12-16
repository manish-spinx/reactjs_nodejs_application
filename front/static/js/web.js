(function ($) {

    $.fn.alert = function (msgHtml, type) {

        var typeClass = 'info';
        
        var icon = "";
        switch (type.toString()) {
            case "error": 
            case "0": 
                icon = "times";  
                typeClass = "danger";
                break;
            case "success": 
            case "1": 
                icon = "check"; 
                typeClass = "success";
                break;
            case "info": 
            case "2": 
                icon = "info"; 
                typeClass = "info";
                break;
            case "warning": 
            case "3": 
                icon = "warning"; 
                typeClass = "warning";
                break;
        }

        var html =
            "<div class=\"alert alert-" + typeClass + " fade in\">" +
                "<a data-dismiss=\"alert\" class=\"close\">×</a>" +
                "<i class=\"fa-fw fa fa-" + icon + "\"></i>" +
                msgHtml +
            "</div>";

        $(this).html(html);

        $("html, body").animate({
            scrollTop: $("[data-msg]").offset().top - 200
        }, 500);
    };

}(jQuery));

(function ($) {

    $.fn.clearMessagesInForm = function () {

        // For smart form design
        $(this).find(".state-error").removeClass("state-error");
        $(this).find(".txt-color-red").remove();
        $(this).find("[data-msg]").html("");

        // For bootstrap form design
        $(this).find(".has-error").children(".form-control-feedback, .help-block").remove();
        $(this).find(".has-error").removeClass("has-error");

    }

}(jQuery));

(function ($) {

    $.showMessages = function (jsonMsg, $form) {

        // if message null or empty return
        if (! jsonMsg) return;
        
        if (jsonMsg.success === false) {
            $.showHeaderMessages(jsonMsg, $form);
            return;
        }

        var errors = jsonMsg.Messages;

        for (var element in errors) {

            if (errors[element].length === 0)
                continue;

            if ($form.hasClass("smart-form")) {
                $form.find("#" + element).parent("label").addClass("state-error")
                    .after("<div class=\"note txt-color-red\">" + errors[element] + "</div>");
            } else if ($form.hasClass("form-horizontal")) {
                
                $form.find("#" + element)
                    .after("<i class=\"form-control-feedback glyphicon glyphicon-remove\"></i>" +
                    "<small class=\"help-block\">" + errors[element] + "</small>")
                    .parent("div").addClass("has-error");

                if ($form.find("[data-checkbox]").length > 0){
                    var elmt = element;

                    if (element.indexOf(".") !== -1)
                        elmt = element.split(".")[0];

                    $form.find("[data-checkbox='" + elmt + "']")
                        .append("<i class=\"form-control-feedback glyphicon glyphicon-remove\"></i>" +
                        "<small class=\"help-block\">" + errors[element] + "</small>")
                        .addClass("has-error");
                }
            }
        }
    }

    $.showHeaderMessages = function (result, $form) {

        // if message null or empty return
        if (result && (!result.Message || result.Message.length === 0)) return;
        
        $form.find("[data-msg]").alert(result.Message, result.MessageType || ( result.Success === false ? "error" : "success"));
    }

}(jQuery));

function MessageTypeToStr(type) {
    switch (type.toString()) {
    case "0":
        return "Danger";
    case "1":
        return "Success";
    case "2":
        return "Info";
    case "3":
        return "Warning";
    }

    return "";
}

$(document).ajaxStart(function () {
        $('.ajax-loader').show();
    })
    .ajaxStop(function () {
        $('.ajax-loader').hide();
    });

$("form[data-ajax=true]").each(function () {

    $(this).submit(function (e) {

        var $form = $(this);

        // Clear all last error messages
        $form.clearMessagesInForm();

        $form.find("[type=\"submit\"]").prop("disabled", true);

        $.ajax({
            url: this.action || window.location.href,
            type: "POST",
            data: $(this).serialize(),
            dataType: "json",
            success: function (result, status, xhr) {

                var ct = xhr.getResponseHeader("content-type") || "";

                if (ct.indexOf("json") > -1) {

                    if (result.Script) {
                        eval(result.Script);
                    }
                
                    if (result.ClearForm) {
                        $form[0].reset();
                    }

                    // If Redriect with Message Then show flash message
                    if (result.Message != null && result.Message.length > 0 && jQuery.trim(result.Redirect) !== "")
                        $.cookie("Flash." + MessageTypeToStr(result.MessageType), result.Message, { path: "/" });

                    if (jQuery.trim(result.Redirect) !== "") {
                        window.location.href = result.Redirect;
                        return;
                    }

                    $.showHeaderMessages(result, $form);
                }

                $form.find("[type=\"submit\"]").prop("disabled", false);

            },
            error: function (jqXhr) {

                switch(jqXhr.status)
                {
                    case 401:
                        //$( location ).prop( 'pathname', 'auth/login' );
                        break;
                    case 422:
                        $.showMessages(jqXhr.responseJSON, $form);
                        break;
                }

                $form.find("[type=\"submit\"]").prop("disabled", false);
            }
        });

        return false;
    });

});

$(document).ready(function() {
    $("body").on("click", "[data-dismiss='alert']", function() {
        $(this).parent().slideUp();
    });
});