//namespace support
var Frontier = Frontier || {};
Frontier.SearchController = Frontier.SearchController || {};
//end namespace support

Frontier.SearchController = new function() {

	var filters = [];

	String.prototype.replaceAll = function(search, replacement) {
	    var target = this;
	    return target.split(search).join(replacement);
	};
	
	function init() {
		console.log("Frontier Search Controller init");
		if(typeof Frontier.SearchResults !== 'undefined') {
			console.log("query string", window.location.search);
			if(window.location.search != "") {
				console.log("doing initial search");
				var searchTerm = getParameterByName("searchCriteria[filter_groups][0][filters][0][value]");
				if(!!searchTerm) {
					searchTerm = searchTerm.replaceAll("%", "");
					$(".search-input").val(searchTerm);
				}
				
				if(!!Frontier.SearchResults){
					showLoadingScreen();
					Frontier.MagentoServices.searchProducts(window.location.search.slice(1, window.location.search.length)).done(function(productList){
						Frontier.SearchResults.updateResults(productList);
						hideLoadingScreen();
					});
				}			
			} else {
				showLoadingScreen();
				Frontier.MagentoServices.searchProducts(getQueryString()).done(function(productList){
					Frontier.SearchResults.updateResults(productList);
					hideLoadingScreen();
				});
			}
		}
		
		$(".search-form").submit(function(event) {
			event.preventDefault();
			window.location = "/content/frontierwholesales/en/search.html?"+getQueryString();
		});
	}
	
	function updateResults(pageNum) {
		showLoadingScreen();
		var queryStringForSearch = getQueryString(pageNum);
		console.log( "Refreshing Search... " + queryStringForSearch);
		Frontier.MagentoServices.searchProducts(queryStringForSearch).done(function(productList){
			if (history.pushState) {
			    var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?" + queryStringForSearch;
			    window.history.pushState({path:newurl},'',newurl);
			}
			Frontier.SearchResults.updateResults(productList);
			hideLoadingScreen();
		});
	}

	function getFilterParam(group_index, index, field, value, type) {
		return "searchCriteria[filter_groups][" + group_index + "][filters][" + index + "][field]=" + field + "&" +
			   "searchCriteria[filter_groups][" + group_index + "][filters][" + index + "][value]=" + value + "&" + 
			   "searchCriteria[filter_groups][" + group_index + "][filters][" + index + "][condition_type]=" + type;
	}
	
	function getQueryString(pageNum) {
		var queryString = "";
		
		var searchTerm = $(".search-input").val();
		queryString += getFilterParam(0,0,"botanicalname",encodeURIComponent("%"+searchTerm+"%"), "like");
		queryString += "&"+ getFilterParam(0,0,"name",encodeURIComponent("%"+searchTerm+"%"), "like");
		
		var filtersQueryString = "";
		
		if(!!Frontier.SearchFacets) {
			var filters = Frontier.SearchFacets.getFilters();
			var groupIndex = 1;
			$.each(filters, function( key, filter ) {
				if(!!filter.value) {
					if(groupIndex > 1) {
						filtersQueryString += "&";
					}
					filtersQueryString += getFilterParam(groupIndex, 0, filter.name, filter.value, "eq");
					groupIndex++;
				}
			});
			filtersQueryString += "&" + getFilterParam(groupIndex, 0, "status", "1", "eq");
			groupIndex++;
			
		} 
		
		if(filtersQueryString.length > 0) {
			queryString += "&"+filtersQueryString ;
		} 
		
		var recsPerPage = $('#itemPerPageSelect').val();
		if(typeof recsPerPage === 'undefined') {
			recsPerPage = 28;
		}
		
		if(typeof pageNum === 'undefined') {
			pageNum = 1;
		}
		
		queryString += "&searchCriteria[currentPage]="+pageNum;
		queryString += "&searchCriteria[pageSize]="+recsPerPage;
		
		return queryString;
	}
	
	this.getQueryString = getQueryString;
	this.updateResults = updateResults;
	
	$(document).ready(init);
}();