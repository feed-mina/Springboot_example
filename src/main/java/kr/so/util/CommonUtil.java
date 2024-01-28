package kr.so.util;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.util.ObjectUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

public class CommonUtil {

	private static SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
	private static SimpleDateFormat sdfyyyymm = new SimpleDateFormat("yyyyMM");
	public static int dscplDay = 7; // 유저 정지 기간

	public static Map<String, Map<String, Object>> loginSession = new LinkedHashMap<String, Map<String, Object>>();

	public static boolean isEmpty(Object obj) {
		return ObjectUtils.isEmpty(obj);
	}

	public static boolean isNotEmpty(Object obj) {
		return !ObjectUtils.isEmpty(obj);
	}

	public static boolean isNull(Object obj) {
		return obj == null;
	}

	public static boolean isNotNull(Object obj) {
		return obj != null;
	}

	@SuppressWarnings("rawtypes")
	public static boolean validation(Map paramMap, List<String> requiredList) throws Exception {

		if (paramMap == null || ObjectUtils.isEmpty(paramMap)) {
			ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
			HttpServletResponse res = attr.getResponse();
			res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			res.setContentType("application/json");
			res.setCharacterEncoding("UTF-8");
			ResponseEntity resEntity = CommonResponse.statusResponse(HttpServletResponse.SC_BAD_REQUEST,
					"paramMap is empty");

			JSONObject jSONObject = new JSONObject();
			jSONObject.putAll((Map) resEntity.getBody());
			res.getWriter().write(jSONObject.toString());

			return false;
		}

		for (String requiredStr : requiredList) {
			if (ObjectUtils.isEmpty(paramMap.get(requiredStr))) {
				ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder
						.currentRequestAttributes();
				HttpServletResponse res = attr.getResponse();
				res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
				res.setContentType("application/json");
				res.setCharacterEncoding("UTF-8");
				ResponseEntity resEntity = CommonResponse.statusResponse(HttpServletResponse.SC_BAD_REQUEST,
						"[" + requiredStr + "] is required");

				JSONObject jSONObject = new JSONObject();
				jSONObject.putAll((Map) resEntity.getBody());
				res.getWriter().write(jSONObject.toString());

				return false;
			}

		}

		return true;
	}

	private static final String emailRegex = "^(.+)@(.+)$";

	@SuppressWarnings("rawtypes")
	public static boolean emailValidation(String emailStr) throws Exception {

		Pattern pattern = Pattern.compile(emailRegex);
		Matcher matcher = pattern.matcher(emailStr);

		if (!matcher.matches()) {
			ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
			HttpServletResponse res = attr.getResponse();

			res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			res.setContentType("application/json");
			res.setCharacterEncoding("UTF-8");
			ResponseEntity resEntity = CommonResponse.statusResponse(HttpServletResponse.SC_BAD_REQUEST,
					"[" + emailStr + "] is Bad Request(email format error)");

			JSONObject jSONObject = new JSONObject();
			jSONObject.putAll((Map) resEntity.getBody());
			res.getWriter().write(jSONObject.toString());

			return false;
		}

		return true;
	}

	private static final String passwordRegex = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]{8,15}$";

	@SuppressWarnings("rawtypes")
	public static boolean passwordValidation(String passwordStr) throws Exception {

		Pattern pattern = Pattern.compile(passwordRegex);
		Matcher matcher = pattern.matcher(passwordStr);

		if (!matcher.matches()) {
			ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
			HttpServletResponse res = attr.getResponse();

			res.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			res.setContentType("application/json");
			res.setCharacterEncoding("UTF-8");
			ResponseEntity resEntity = CommonResponse.statusResponse(HttpServletResponse.SC_BAD_REQUEST,
					"[" + passwordStr + "] is Bad Request(영문/숫자/특수문자 조합 8자이상 15자 이하로 입력하세요.)");

			JSONObject jSONObject = new JSONObject();
			jSONObject.putAll((Map) resEntity.getBody());
			res.getWriter().write(jSONObject.toString());

			return false;
		}

		return true;
	}

	public static String randomPass() throws Exception {

		StringBuffer temp = new StringBuffer();
		StringBuffer special = new StringBuffer("!@#$%^&*");

		Random rnd = new Random();
		for (int i = 0; i < 10; i++) {
			int rIndex = rnd.nextInt(3);
			switch (rIndex) {
			case 0:
				// a-z
				temp.append((char) ((rnd.nextInt(26)) + 97));
				break;
			case 1:
				// A-Z
				temp.append((char) ((rnd.nextInt(26)) + 65));
				break;
			case 2:
				// 0-9
				temp.append((rnd.nextInt(10)));
				break;
			}
		}

		temp.setCharAt(2, special.charAt((int) (Math.random() * special.length() - 1)));

		return temp.toString();
	}

	public static String getClientIP(HttpServletRequest request) {
		String ip = request.getHeader("X-Forwarded-For");

		if (ip == null) {
			ip = request.getHeader("Proxy-Client-IP");
		}
		if (ip == null) {
			ip = request.getHeader("WL-Proxy-Client-IP");
		}
		if (ip == null) {
			ip = request.getHeader("HTTP_CLIENT_IP");
		}
		if (ip == null) {
			ip = request.getHeader("HTTP_X_FORWARDED_FOR");
		}
		if (ip == null) {
			ip = request.getRemoteAddr();
		}

		return ip;
	}

	public static String getToday() throws Exception {
		Date today = new Date();
		return sdf.format(today);
	}

	public static String getCurMM() throws Exception {
		Date today = new Date();
		return sdfyyyymm.format(today);
	}

	public static boolean isDscplOverDay(String date) {
		try {
			DateFormat format = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
			Date dscplDate = format.parse(date);
			Date today = new Date();

			Calendar dscplOverDay = Calendar.getInstance();
			dscplOverDay.setTime(dscplDate);
			dscplOverDay.add(Calendar.DATE, dscplDay);

			if (today.getTime() >= dscplOverDay.getTimeInMillis()) {
				return true;
			} else {
				return false;
			}
		} catch (Exception e) {
			return false;
		}
	}

	/**
	 * 
	 * @param request
	 * @return https://domain.com:443 처럼 scheme + host + port 리턴
	 */
	public static String getHostAddress(HttpServletRequest request){
		String scheme = request.getScheme();
        String serverName = request.getServerName();
        int serverPort = request.getServerPort();

        StringBuilder baseUrlBuilder = new StringBuilder();
        baseUrlBuilder.append(scheme).append("://").append(serverName);

        if (("http".equals(scheme) && serverPort != 80) || ("https".equals(scheme) && serverPort != 443)) {
            baseUrlBuilder.append(":").append(serverPort);
        }
		String result = baseUrlBuilder.toString(); 

		return result;
	}
}
