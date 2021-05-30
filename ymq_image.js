$(document).ready(function () {
    var form_data = $('#defaultForm').serialize();
    var ajaxData = {};
    $(".colorpickerinput").colorpicker({
        format: 'hex',
        component: '.input-group-append',
        extensions: [{
            name: 'preview',
            options: {
                showText: true,
                template:'<div class="colorpicker-bar colorpicker-preview"><input type="text" class="form-control"></div>'
            }
        }]
    });
    $(".colorpickerinput").on('focus',function(){
        var that = $(this);
        var pickDom = $("#"+$(this).attr("aria-describedby"));
        pickDom.find('.form-control').val($(this).val()).bind('input propertychange',function () {
            that.val($(this).val());
            that.trigger('change');
        });
    });
    $(".colorpickerinput").on('change',function(){
        $(this).prev('.color-btn').css('background-color',$(this).val());
        do_change();
    });
    do_change();
    $('#defaultForm input[type="number"]').on('keyup',function(){
        do_change();
    });
    function do_change(){
        var style = ':root{';
        $('#defaultForm').find('input').each(function () {
            ajaxData[$(this).attr('name')] = $(this).val();
            style += `${$(this).attr('name')}: ${$(this).val()};`;
        });
        style += '}';
        $("#jsstyle").html(style);
        console.log(ajaxData);
    }

    $(".color-btn").on('click',function () {
        $(this).next('.colorpickerinput').trigger('focus');
    });

    $('a').on('click',function () {
        var href = $(this).attr('href');

        if (form_data != $('#defaultForm').serialize()){
            $(this).fireModal({
                title: 'You have unsaved changes on this page',
                body: 'If you leave this page, all unsaved changes will be lost. Are you sure you want to leave this page?',
                center: true,
                initShow: true,
                removeOnDismiss: true,
                buttons: [
                    {
                        text: 'Cancel',
                        class: 'btn btn-secondary btn-shadow',
                        handler: function(modal) {
                            modal.modal('hide');
                        }
                    },
                    {
                        text: 'Leave page',
                        class: 'btn btn-danger btn-shadow',
                        handler: function(modal) {
                            window.location.href=href;
                        }
                    }
                ]
            });
            return false;
        }
        // window.location.href=href;
    });
    function removeDis(){
        if (form_data != $('#defaultForm').serialize()) {
            $('.save,.creat').removeClass('disabled');
        }else{
            $('.save,.creat').addClass('disabled');
        }
    }
    $("input,select,textarea").on('change', function() {
        removeDis();
    });

    $(".style-save").on('click',function () {
        removeDis();
        if (!$(this).hasClass('disabled')){
            var that = $(this);
            that.addClass('btn-progress').addClass('disabled');

            $.ymqajax({
                url: " /api/branding/style",
                data: $('#defaultForm').serialize(),
                success: function (res) {
                    form_data = $('#defaultForm').serialize();
                    that.removeClass('btn-progress');
                    iziToast.show({
                      message: "Save success,Please wait up to 60 seconds for the change to take effect.",
                      position: 'bottomCenter'
                    });
                },
                error: function (res) {
                    that.removeClass('btn-progress');
                    iziToast.show({
                      message: "Unknown error please try again!",
                      position: 'bottomCenter'
                    });
                }
            });
        }
    });
    $('.custom-switch-indicator').on('click',function () {
        var that = $(this);
        that.parents('.card').addClass('ymq-card-progress');
        var url = '/api/branding/extra';
        if (that.data('url')){
            url = that.data('url');
        }
        var key = that.data('key');
        var data = that.prev().prop('checked') ? 0 : 1;
        $.ajax({
            type: 'POST',
            url: url,
            dataType: 'json',
            data: {key,data},
            success: function (res) {
                that.prev().prop('checked',!that.prev().prop('checked'));
                if (that.prev().prop('checked')){
                    iziToast.show({
                        message: "Turn On Success",
                        position: 'bottomCenter'
                    });
                    that.parents('.card').removeClass('card-danger').addClass('card-success').removeClass('ymq-card-progress');
                }else{
                    iziToast.show({
                        message: "Turn Off Success",
                        position: 'bottomCenter'
                    });
                    that.parents('.card').removeClass('card-success').addClass('card-danger').removeClass('ymq-card-progress');
                }

            },
            error: function (jqXHR) {
                iziToast.show({
                    message: "Unknown error please try again",
                    position: 'bottomCenter'
                });
                that.parents('.card').removeClass('ymq-card-progress');
            }
        });


    });

    $('.need-js-change-css input').on('change',function (){
        var style = ':root{';
        $('.style-input').each(function (){
            style += `
                ${$(this).attr('name')}:${$(this).val()};
            `;
        });
        style += '}';
        $('#ymq-image-jsstyle').html(style);
    });

    $("body").on('click',function () {
        $('.icon-box').hide();
    });
    $(".icon-choose-btn").on('click',function () {
        $(this).next().next().toggle();
        event.stopPropagation();
    });
    $(".icon_box_big").on('click',function () {
        if ($('.big-icon-url').val() == "") {
            $(this).parent().parent().parent().next().val($(this).data('value'));
            $(this).parent().parent().prev().html($(this).html());
        }else{
            alert(`You have set "custome icon url(big)", the modification here will not take effect, please clear "custome icon url(big)" before operation`);
        }
        do_change();
    });
    $(".big-icon-url").on('change',function(){
        if ($(this).val() != "") {
            $('.big_now_icon_box1').html(`<img class="ymq_icons ymq_icons_img left_icon" src="${$(this).val()}"><img class="ymq_icons ymq_icons_img" src="${$(this).val()}">`);
        }else{
            $('.big_now_icon_box1').html(`
                <span class="icon ymq_iconfont ymq_image_icons left_icon">${$('.big-icon-input').val()}</span>
                <span class="icon ymq_iconfont ymq_image_icons">${$('.big-icon-input').val()}</span>
            `);
        }
    });





    $(".is_thumbnail_select").on('change',function(){
        if (Number($(this).val()) == 1) {
            $('.is_thumbnail').show();
        }else{
            $('.is_thumbnail').hide();
        }
    })

    $(".big-icon-url").change();
});