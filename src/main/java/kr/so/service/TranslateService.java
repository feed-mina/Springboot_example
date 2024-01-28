package kr.so.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import kr.so.util.CamelHashMap;
import kr.so.util.JSONObject;

@Service
public class TranslateService {

	private final String BASE_URL = "https://translation.googleapis.com/language/translate/v2";
	private final String API_KEY = "AIzaSyAIVn3Dv8t-r6s2d0wY0byf3nB6Dnz3_6s";
	
	// const API_KEY = "AIzaSyAIVn3Dv8t-r6s2d0wY0byf3nB6Dnz3_6s";

	public Map<String, Object> getTranslatedMap (String text, String source, String target){
		Map<String,Object> transMap = new JSONObject();
		transMap.put("q", text);
		transMap.put("source", source);
		transMap.put("target", target);

		Map<String, Object> response = new RestTemplate().postForObject(
			BASE_URL+"?key=" + API_KEY
				// "http://sjhtest.musicen.com/same/3"
			, transMap, CamelHashMap.class);
		System.out.println(response);

		// {data={translations=[{translatedText=?好！！, detectedSourceLanguage=ko}]}}
		Map<String, Object> map1 = (Map<String, Object>) response.get("data");
		List<Map<String, Object>> map2 = (List<Map<String, Object>>) map1.get("translations");
		Map<String, Object> map3 = map2.get(0);
		return map3;
	}

	public String translateText (String text, String source, String target){
		Map<String, Object> map = getTranslatedMap(text, source, target);
		return (String) map.get("translatedText");
	}
}
