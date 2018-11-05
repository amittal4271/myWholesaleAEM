package com.frontierwholesales.core.magento.services.models;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;

import javax.annotation.PostConstruct;

import org.apache.commons.lang.StringEscapeUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.frontierwholesales.core.beans.FrontierWholesaleBrand;
import com.frontierwholesales.core.magento.services.FrontierWholesalesMagentoCommerceConnector;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@Model(adaptables = { SlingHttpServletRequest.class, Resource.class })
public class ShopByBrandModel extends BaseModel {
	private static final Logger LOGGER = LoggerFactory.getLogger(ShopByBrandModel.class);

	private String brandListResponse;

	
	private JsonParser parser = new JsonParser();
	
	private ArrayList<String> letters = new ArrayList<String>();

	private HashMap<String, List<FrontierWholesaleBrand>> brandMap = new HashMap<String, List<FrontierWholesaleBrand>>();

	@PostConstruct
	protected void init() {
		mapper.configure(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true);
		try {
			connector.setServer(getMagentoServer());
			brandListResponse = connector.getBrands(getAdminToken());

			JsonArray brandsArr = parser.parse(brandListResponse).getAsJsonArray();
			
			for (JsonElement brandElem : brandsArr) {
				
				
			    JsonObject brandObj = brandElem.getAsJsonObject();
			    String name = brandObj.get("label").getAsString();
			    String id = brandObj.get("value").getAsString();
			    
			    if(name != null && name.length() > 0 && !"".equals(name.trim())) {
			    
			    	String firstletter = " ";
			    
			    	firstletter = name.substring(0, 1).toUpperCase();
				    
				    if(!letters.contains(firstletter)) {
				    	letters.add(firstletter);
				    }
				    
				    List<FrontierWholesaleBrand> brandsList = brandMap.getOrDefault(firstletter, new ArrayList<FrontierWholesaleBrand>());
				    
				    FrontierWholesaleBrand brand = new FrontierWholesaleBrand();
				    brand.setName(StringEscapeUtils.unescapeHtml(name));
				    brand.setId(id);
				    brandsList.add(brand);
				    
				    brandMap.put(firstletter, brandsList);
			    }
			}
			
			Collections.sort(letters, String.CASE_INSENSITIVE_ORDER);
			
			for(String key : brandMap.keySet()) {
				Collections.sort(brandMap.get(key), new Comparator<FrontierWholesaleBrand>() {
				    @Override
				    public int compare(FrontierWholesaleBrand b1, FrontierWholesaleBrand b2) {
				        
				    	String s1 = b1.getName();
				    	String s2 = b2.getName();
				    	
				    	return s1.compareToIgnoreCase(s2);
				    }
				});
			}
			

		} catch (Exception e) {
			LOGGER.error("Error in shopbybrand ", e, e.getMessage());
		}
	}

	public String getBrands() {
		return brandListResponse;
	}

	public List<String> getLetterList() {
		return letters;
	}
	
	public HashMap<String, List<FrontierWholesaleBrand>> getBrandMap(){
		return brandMap;
	}

}
