angular
    .module('App')
    .controller('HomeCtrl', function ($location, _, kendo, SearchOfferSvc, localStorageService, searchOptions, offers) {
        var vm = this;

        vm.categories = searchOptions.AdvertiserCategories;
        vm.subCategories = new kendo.data.ObservableArray(searchOptions.AdvertiserSubCategories);
        vm.states = searchOptions.States;
        vm.regions = searchOptions.Regions;
        vm.offerAmounts = searchOptions.OfferAmounts;
        vm.companyRatings = searchOptions.CompanyRatings;
        vm.offers = offers;
        
        vm.changeCategory = changeCategory;
        vm.changeOfferAmount = changeOfferAmount;
        vm.searchByParams = searchByParams;
        
        _init(vm.offers);

        function _init(offersArray) {
            vm.search = {};

            var id = 0;
            vm.offerAmounts = _.each(vm.offerAmounts, function (offerAmount) {
                offerAmount.Id = id;
                id += 1;
            });

            offersArray.forEach(function (offer) {
                offer.OfferSite = offer.OfferSite.indexOf('http') !== -1 ? offer.OfferSite : 'http://' + offer.OfferSite;
                offer.AdvertiserCategory = offer.AdvertiserCategory ? offer.AdvertiserCategory.replace(' ', '').replace(',', ' | ') : '';
                offer.takeAdvantageLink = SearchOfferSvc.getLinkToOfferDetails(offer.Id);
                offer.bhLink = SearchOfferSvc.getLinkToBusinessHighlights(offer.AdvertiserId);
            });
        }

        function changeCategory() {
            vm.search.AdvertiserSubCategoryIds = vm.search.AdvertiserCategoryId ? null : '';

            vm.subCategories.splice(0, vm.subCategories.length);

            if (+vm.search.AdvertiserCategoryId) {
                var subCats = _.filter(searchOptions.AdvertiserSubCategories, function(category) {
                    return category.AdvertiserCategoryId == vm.search.AdvertiserCategoryId;
                });
            } else {
                subCats = searchOptions.AdvertiserSubCategories;
            }

            vm.subCategories.push.apply(vm.subCategories, subCats);
        }

        function changeOfferAmount() {
            vm.search.OfferAmount = _.map(vm.offerAmounts, function(offerAmount) {
                if (_.contains(vm.searchOfferAmount, offerAmount.Id.toString())) {
                    return { MinValue: offerAmount.MinValue, MaxValue: offerAmount.MaxValue };
                }
            });

            vm.search.OfferAmount = _.filter(vm.search.OfferAmount, function(offerAmount) {
                return !!offerAmount;
            })
        }

        function searchByParams() {
            if (!_.isEmpty(vm.search)) {
                _calibrateParameters(vm.search);
                localStorageService.set('searchParameters', vm.search);
            }

            $location.url('/Search');
        }

        function _calibrateParameters(params) {
            _.each(params, function (val, key) {
                val = parseInt(val);

                if (!isNaN(val)) {
                    params[key] = val;
                }
            });

            if (params.AdvertiserCategoryId == undefined && params.AdvertiserSubCategoryIds != undefined) {
                var subCat = _.filter(vm.subCategories, function (subCat) {
                    return subCat.Id == params.AdvertiserSubCategoryIds;
                }).shift();

                params.AdvertiserCategoryId = subCat.AdvertiserCategoryId;
            }

            if (params.AdvertiserSubCategoryIds) {
                params.AdvertiserSubCategoryIds = [params.AdvertiserSubCategoryIds];
            }

            if (params.StateId != undefined) {
                params.StateId += '';
            }

            if (!params.OfferAmount || !params.OfferAmount.length) {
                params.OfferAmount = null;
            }
        }
    });