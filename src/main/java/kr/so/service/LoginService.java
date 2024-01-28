package kr.so.service;

import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.so.encrypt.AES256Encrypt;
import kr.so.mvc.service.CommonService;
import kr.so.util.CommonUtil;
import kr.so.util.JSONObject;

@Service
public class LoginService {

	private Logger log = LoggerFactory.getLogger(this.getClass());

	@Autowired
	CommonService commonService;

	@Autowired
	ImageService imageService;

	public void doSave(Map<String, Object> paramMap, HttpServletRequest request) throws Exception {
		// 유저 생성
		commonService.insert("login.userRegist", paramMap);

		// 동의여부 insert
		Map<String, String> stplatCode = (Map<String, String>) paramMap.get("stplatCode");
		for (Entry<String, String> stplatcode : stplatCode.entrySet()){
			paramMap.put("stplatCode", stplatcode.getKey());
			paramMap.put("agreAt", stplatcode.getValue());
			commonService.insert("login.userStplat", paramMap);
		}

		JSONObject rewardJson = new JSONObject();
		rewardJson.put("userSeq", paramMap.get("userSeq"));
		String jsonString = AES256Encrypt.encrypt(rewardJson.toString());

		// 이메일 전송
		String targetUrl = CommonUtil.getHostAddress(request) + "/sch/user/registerEmailComplete.html?encData=" + jsonString;
	//	alarmService.insertUserRegistAlarm((String) paramMap.get("userSeq"), targetUrl);

	}

	public void doUpdate(Map<String, Object> paramMap) throws Exception {
		// userSeq가 있으면 유저필드 update
		commonService.update("login.userUpdate", paramMap);

		// 동의여부 update
		Map<String, String> stplatCode = (Map<String, String>) paramMap.get("stplatCode");
		if(CommonUtil.isNotEmpty(stplatCode)){
			for (Entry<String, String> stplatcode : stplatCode.entrySet()){
				paramMap.put("stplatCode", stplatcode.getKey());
				paramMap.put("agreAt", stplatcode.getValue());
				commonService.insert("login.userStplatUpdate", paramMap);
			}
		}
	}

	


}
