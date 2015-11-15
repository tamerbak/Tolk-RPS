/**
 * Created by abenaicha on 15/11/15.
 */
angular.module('Services', [])
    .service('invitationService', function ($cordovaDialogs) {

        this.showConfirm = function () {

            $cordovaDialogs.confirm(
                'Voulez-vous le contacter via : ', // message
                'Invitation à Tolk', // title
                ['SMS', 'E-mail']	// buttonLabels
            ).then(function(buttonIndex) {
                    // no button = 0, 'SMS' = 1, 'E-mail' = 2

                    //SMS
                    if (buttonIndex == 1) {

                        window.plugins.webintent.hasExtra(window.plugins.webintent.EXTRA_TEXT,
                            function (has) {
                                // has is true iff it has the extra
                                window.plugins.webintent.startActivity({
                                        action: window.plugins.webintent.ACTION_VIEW,
                                        url: 'smsto:' + ''
                                    },
                                    function () {
                                    },
                                    function () {
                                        alert('Failed to open URL via Android Intent')
                                    });
                            }, function () {
                                // Something really bad happened.
                                alert('Erreur système Android');
                            }
                        );

                    }
                    //E-mail
                    else if (buttonIndex == 2) {

                        window.plugins.webintent.hasExtra(window.plugins.webintent.EXTRA_TEXT,
                            function (has) {
                                // has is true iff it has the extra
                                var extras = {};
                                extras[webintent.EXTRA_SUBJECT] = "Sujet";
                                extras[window.plugins.webintent.EXTRA_TEXT] = "Contenu";
                                window.plugins.webintent.startActivity({
                                        action: window.plugins.webintent.ACTION_VIEW,
                                        url: 'mailto:' + ''
                                    },
                                    function () {
                                    },
                                    function () {
                                        alert('Failed to open URL via Android Intent')
                                    });

                            }, function () {
                                // Something really bad happened.
                                alert('Erreur système Android');
                            }
                        );

                    }
                });
        }
    });