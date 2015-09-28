angular
    .module('App')
    .directive('stickyFooter', function stickyFooter($window, $timeout) {
        return {
            restrict: 'A',
            link: function (scope, _$footer, attrs) {
                var _$html = $('html'),
                    _$body = $('body'),
                    _$window = $($window),
                    footerHeight,
                    bodyPadding;

                var footer = {
                    init: function () {
                        this.setOptions();
                        this.bindEvents();
                        this.preAdjustFooter();
                    },
                    setOptions: function () {
                        _$html.css({ height: '100%' });
                        bodyPadding = parseInt(_$body.css('padding-bottom'));
                        _$body.css({ 'min-height': '100%', position: 'relative' });
                        _$footer.css({ bottom: 0, width: '100%', position: 'absolute' });
                    },
                    bindEvents: function () {
                        _$window.on('orientationchange resize', footer.preAdjustFooter);
                    },
                    preAdjustFooter: function (event) {
                        $timeout(footer.adjustFooter, 0);
                    },
                    adjustFooter: function () {
                        footerHeight = footer.getElemFullHeight(_$footer);

                        _$body.css('padding-bottom', bodyPadding + footerHeight);
                    },
                    getElemFullHeight: function (elem) {
                        return elem.height() + parseInt(elem.css('margin-top')) + parseInt(elem.css('margin-bottom'));
                    }
                };

                footer.init();
            }
        }
    });
    
/**
 * Example:
 * 
 ...
    <footer class="container" data-sticky-footer>
    ...
 ...
 */