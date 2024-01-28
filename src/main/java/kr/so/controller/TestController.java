package kr.so.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import kr.so.configuration.security.JwtTokenProvider;
import kr.so.encrypt.AES256Encrypt;
import kr.so.encrypt.SHA256Encrypt;
import kr.so.service.CommonService;
import kr.so.service.FileService;
import kr.so.util.CamelHashMap;
import kr.so.util.CommonResponse;
import kr.so.util.CommonUtil;
import kr.so.util.UserParam;

@Api(tags = "ADMIN - 9999 TEST API", description = "백엔드 개발 테스트용 입니다.여기 있는 api는 사용하지 마세요.")
@RestController
@RequestMapping("/test")
public class TestController {
	@Value("${spring.jwt.secret}")
	private String secretKey;

	private Logger log = LoggerFactory.getLogger(this.getClass());

	@Autowired
	CommonService commonService;

	@Autowired
	JwtTokenProvider jwtTokenProvider;
	
	
	@Autowired
	FileService fileService;
 

	@Value("${file.upload-dir}")
	private String uploadDir;

	@PostMapping(value = "/test.api")
	@ApiOperation(value = "test", notes = "no parameter 테스트 API")
	public ResponseEntity<?> test(HttpServletRequest req) throws Exception {

		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, commonService.selectList("test.test", null));
	}

	@ApiOperation(value = "해싱 암호화", notes = "해싱 암호화")
	@GetMapping(value = "/sha256")
	public String sha256(@RequestParam("key") String key) throws Exception {
		String encrypt = SHA256Encrypt.encrypt(key);
		return encrypt;
	}

	@ApiOperation(value = "AES 암호화", notes = "AES 암호화")
	@GetMapping(value = "/encrypt")
	public String encrypt(@RequestParam("key") String key) throws Exception {
		String encrypt = AES256Encrypt.encrypt(key);
		return encrypt;
	}

	@ApiOperation(value = "AES 복호화", notes = "AES 복호화")
	@GetMapping(value = "/dencrypt")
	public String dencrypt(@RequestParam("key") String key) throws Exception {
		String dencrypt = AES256Encrypt.decrypt(key);
		return dencrypt;
	}

	@PostMapping(value = "/testcrypto.api")
	@ApiOperation(value = "test", notes = "no parameter 테스트 API")
	@ApiImplicitParam(name = "paramMap", value = "{\"test\":\"test\",\"test2\":\"test2\"}", example = "{\"test\":\"test\",\"test2\":\"test2\"}", required = true, dataTypeClass = String.class)
	public ResponseEntity<?> testcrypto(Map<String, Object> paramMap) throws Exception {

		log.info("asdfasdfasdf ===", paramMap);

		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, commonService.selectList("test.test", null));
	}

	@PostMapping(value = "/test2.api")
	@ApiOperation(value = "test2", notes = "required parameter를 체크합니다.\ntest와 test2 파라미터가 둘 다 입력되어야 <b>정상응답(200)</b>을 하고\n부족시 <b>400 bad request</b> 응답합니다.")
	@ApiImplicitParam(name = "paramMap", value = "{\"test\":\"test\",\"test2\":\"test2\"}", example = "{\"test\":\"test\",\"test2\":\"test2\"}", required = true, dataTypeClass = String.class)
	public ResponseEntity<?> test2(@RequestBody Map<String, Object> paramMap) throws Exception {

		List<String> requiredList = Arrays.asList("test", "test2");
		if (!CommonUtil.validation(paramMap, requiredList)) {
			return null;
		}

		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, "파라미터 정상");
	}

	@PostMapping(value = "/testLogin.api")
	@ApiOperation(value = "login 테스트", notes = "login 테스트 API")
	@ApiImplicitParam(name = "paramMap", value = "{\"userEmail\":\"sch@musicen.com\"}", example = "{\"userEmail\":\"sch@musicen.com\"}", required = true, dataTypeClass = String.class)
	public ResponseEntity<?> testLogin(@RequestBody Map<String, Object> paramMap, HttpServletRequest req)
			throws Exception {

		Map<String, Object> loginMap = commonService.selectMap("test.selectTestLogin", paramMap);

		if (ObjectUtils.isEmpty(loginMap)) {
			return CommonResponse.statusResponse(HttpServletResponse.SC_BAD_REQUEST, "로그인 정보를 확인하세요.");
		}

		System.out.println(loginMap.get("userEmail"));

		String jwtToken = jwtTokenProvider.createToken(loginMap.get("userSeq").toString(),
				loginMap.get("userAuthor").toString());
		System.out.println(jwtToken);

		loginMap.put("jwtToken", jwtToken);

		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, loginMap);
	}

	@PostMapping(value = "/refresh")
	public ResponseEntity<?> refresh(@RequestBody Map<String, Object> paramMap) {
		String oldToken = (String) paramMap.get("accessToken");

		try {
			String newToken = jwtTokenProvider.refreshToken(oldToken);
			paramMap.put("newToken", newToken);
			return CommonResponse.statusResponse(HttpServletResponse.SC_OK, paramMap);
		} catch (Exception e) {
			return CommonResponse.statusResponse(HttpServletResponse.SC_UNAUTHORIZED);
		}
	}

	@PostMapping(value = "/userParam")
	public ResponseEntity<?> userParam(@UserParam Map<String, Object> paramMap) {

		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, paramMap);
	}

	@PostMapping(value = "/requestBody")
	// @ApiImplicitParams({
	// @ApiImplicitParam(name = "id", value = "ab", required = true),
	// @ApiImplicitParam(name = "user", value = "cd", required = true) })
	@ApiImplicitParams({
			@ApiImplicitParam(name = "paramMap", value = "{\"petName\":\"\b펫이름(필수,6글자맥스)\"\n"
					+ ",\"petCode\":\"펫코드(필수)\"}", example = "{\"petName\":\"불멸의핫도그\"\n"
							+ ",\"petCode\":\"PET_001\"}", required = true, dataTypeClass = String.class),
			@ApiImplicitParam(name = "paramMap", value = "{\"petName\":\"\b펫이름(필수,6글자맥스)\"\n"
					+ ",\"petCode\":\"펫코드(필수)\"}", example = "{\"petName\":\"불멸의핫도그\"\n"
							+ ",\"petCode\":\"PET_001\"}", required = true, dataTypeClass = String.class) })
	public ResponseEntity<?> requestBody(@RequestBody Map<String, Object> paramMap) {

		System.out.println(paramMap);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, paramMap);
	}

	@ApiOperation(value = "회원 등록", notes = "신규 회원 등록")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{\r\n" + //
			"\t\"title\":\"\uB9AC\uC5BC\uCE90\uC2AC\",\r\n" + //
			"\t\"title2\":\"2\uB9AC\uC5BC\uCE90\uC2AC\",\r\n" + //
			"\t\"title3\":\"3\uB9AC\uC5BC\uCE90\uC2AC\",\r\n" + //
			"\t\"title4\":\"4\uB9AC\uC5BC\uCE90\uC2AC\"\r\n" + //
			"}", example = "{\r\n" + //
					"\t\"title333\":\"\uB9AC\uC5BC\uCE90\uC2AC\",\r\n" + //
					"\t\"title2\":\"2\uB9AC\uC5BC\uCE90\uC2AC\",\r\n" + //
					"\t\"title3\":\"3\uB9AC\uC5BC\uCE90\uC2AC\",\r\n" + //
					"\t\"title4\":\"4\uB9AC\uC5BC\uCE90\uC2AC\"\r\n" + //
					"}")
	@PostMapping(value = "/swaggerTest/{idx}")
	public ResponseEntity<?> userParasm(@RequestBody Map<String, Object> paramMap, @PathVariable("idx") String idx) {
		paramMap.put("idx", idx);

		String aa = "{\r\n" + //
				"\t\"a\":1,\r\n" + //
				"\t\"b\":1,\r\n" + //
				"}";

		Map<String, String> er = new HashMap<String, String>();
		er.put("a", "B");
		er.put("a2", "Bc");
		er.put("a3", "Bs");

		paramMap.put("whow", er);

		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, paramMap);
	}

	@PostMapping(value = "/fileUpload")
	public ResponseEntity<?> userPasefrasm(@RequestParam(name = "file1", required = false) MultipartFile[] file1,
			@RequestParam(name = "file2", required = false) MultipartFile[] file2,
			@RequestParam(name = "paramMap") String paramMap) throws IllegalStateException, IOException {

		// 파일 저장하기, 파일객체 내장 transferTo메소드 사용
		file1[0].transferTo(Paths.get("C:\\TestDir" + File.separator + "abc.txt").toAbsolutePath());

		// 썡 string('{a:1, b:"hello"}')으로 날아온 json데이터 파싱하기
		Map<String, Object> parsed = (new ObjectMapper()).readValue(paramMap, new TypeReference<Map<String, Object>>() {
		});
		System.out.println(parsed);

		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, parsed);
	}

	@PostMapping(value = "/fileUpload2")
	public ResponseEntity<?> userPasefrasm2(@RequestParam(name = "file1", required = false) MultipartFile[] file1,
			@RequestParam(name = "file2", required = false) MultipartFile[] file2,
			@RequestParam(name = "paramMap") Map<String, Object> paramMap) throws IllegalStateException, IOException {

		// 썡 string('{a:1, b:"hello"}')으로 날아온 json데이터 파싱하기
		// Map<String, Object> parsed = (new ObjectMapper()).readValue(paramMap, new
		// TypeReference<Map<String, Object>>() {});
		System.out.println("############");
		System.out.println(paramMap);

		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, paramMap);

	}

	@PostMapping(value = "/ioio")
	public ResponseEntity<?> werrr(@RequestParam(name = "paramMap") Map<String, Object> paramMap) {
		System.out.println("(*(*))");
		System.out.println(paramMap);

		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, paramMap);
	}

	@PostMapping(value = "/stplatCode")
	public ResponseEntity<?> werrre(@RequestBody Map<String, Object> paramMap) {
		// System.out.println("(*(*))");
		System.out.println(paramMap);

		// commonService.insert("login.userStplat", (Map<String, Object>)
		// paramMap.get("stplatCode"));

		System.out.println("@@@@@entrySet()@@@@@");
		Map<String, String> wer = (Map<String, String>) paramMap.get("stplatCode");
		for (Entry<String, String> entry : wer.entrySet()) {
			System.out.println("[key]:" + entry.getKey() + ", [value]:" + entry.getValue());
		}

		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, paramMap);
	}

	@PostMapping(value = "/selectCheckExist")
	public ResponseEntity<?> selectCheckExist(@RequestBody Map<String, Object> paramMap) {
		System.out.println(paramMap);

		// paramMap.put("checkEntity", "userNcnm");
		paramMap.put("checkEntity", "userEmail");

		Map<String, Object> gogo = commonService.selectMap("login.selectCheckExist", paramMap);

		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, gogo);
	}

	@PostMapping(value = "/fileTest1.api", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	@ApiOperation(value = "Admin-21-3 에셋번들 저장", notes = "에셋번들 저장합니다.")
	public ResponseEntity<?> saveAssets(
			@RequestPart(value = "uploadAndroidFile", required = true) MultipartFile[] uploadAndroidFile,
			@RequestParam(value = "paramMap", required = true) Map<String, Object> paramMap, HttpServletRequest req)
			throws Exception {

		Map<String, Object> sessionMap = CommonUtil.loginSession
				.get(jwtTokenProvider.getUserPk(jwtTokenProvider.resolveToken(req)));

		paramMap.put("user", sessionMap);
		System.out.println(paramMap);

		fileService.fileRegist(uploadAndroidFile, paramMap, "testImg");

		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, paramMap);
	}

	@GetMapping(value = "/userImage.api")
	@ApiOperation(value = "", notes = ".")
	public ResponseEntity<?> saveAssetas(@RequestParam String paramMap) throws Exception {

		Map<String, Object> objectMap = new HashMap();
		objectMap.put("wef", paramMap);
		commonService.selectMap("user.userInfo", objectMap);
		// Map<String, Object> sessionMap = CommonUtil.loginSession
		// .get(jwtTokenProvider.getUserPk(jwtTokenProvider.resolveToken(req)));

		// paramMap.put("user", sessionMap);
		// System.out.println(paramMap);

		// fileService.fileRegist(uploadAndroidFile, paramMap,"testImg");

		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, paramMap);
	}

	/*
	 * @PostMapping(value = "/testPush.api")
	 * 
	 * @ApiOperation(value = "testPush 테스트", notes = "testPush 테스트 API")
	 * 
	 * @ApiImplicitParam(name = "paramMap", value =
	 * "{\"user_email\":\"kjh@musicen.com\",\n" + "\"title\":\"공지\",\n" +
	 * "\"message\":\"안녕하세요 푸시보냅니다.\"}", example =
	 * "{\"user_email\":\"kjh@musicen.com\",\n" + "\"title\":\"공지\",\n" +
	 * "\"message\":\"안녕하세요 푸시보냅니다.\"}", required = true, dataTypeClass =
	 * String.class) public ResponseEntity<?> pushSend(@RequestBody Map<String,
	 * Object> paramMap, HttpServletRequest req) throws Exception {
	 * 
	 * Map<String, Object> resultMap = commonService.selectMap("fcm.selectUserData",
	 * paramMap);
	 * 
	 * if (ObjectUtils.isEmpty(resultMap)) { return
	 * CommonResponse.statusResponse(HttpServletResponse.SC_BAD_REQUEST,
	 * "로그인 정보를 확인하세요."); }
	 * 
	 * fcmService.sendTargetMessage((String) resultMap.get("deviceToken"), (String)
	 * paramMap.get("title"), (String) paramMap.get("message"), (String)
	 * resultMap.get("appOs"), resultMap); return
	 * CommonResponse.statusResponse(HttpServletResponse.SC_OK, resultMap); }
	 */
	@GetMapping(value = "/requestUri.api")
	@ApiOperation(value = "현재 요청에대한 scheme + host + port를 리턴", notes = ".")
	public ResponseEntity<?> sef(@RequestParam String paramMap, HttpServletRequest request) throws Exception {

		String re = CommonUtil.getHostAddress(request);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, re);
	}


	// @PostMapping(value = "/mailTest.api")
	// @ApiImplicitParams({ @ApiImplicitParam(name = "paramMap", value = "{\"userEmail\":\"popp@musicen.com\"\n"
	// 		+ "}", required = true, dataTypeClass = String.class) })
	// public ResponseEntity<?> mailTest(@RequestBody Map<String, Object> paramMap) throws Exception {

	// 	ClassPathResource resource = new ClassPathResource("templates/forget_mail.html");

	// 	InputStream inputStream = resource.getInputStream();
	// 	String mailData = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8)).lines()
	// 			.collect(Collectors.joining("\n"));
	// 	String tempPassword = CommonUtil.randomPass();
	// 	mailData = mailData.replace("${{password}}", tempPassword);

	// 	emailService.sendMail((String) paramMap.get("userEmail"), "리얼캐슬 임시비밀번호입니다.", mailData);
	// 	return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
	// }

	/*@GetMapping(value = "/emailComplete.api")
	@ApiOperation(value = "메일템플릿 테스트", notes = "/test/emailComplete.api?userEmail=sjh@musicen.com&emailYn=N emailYn이 N이면 html로리턴해서 테스트")
	public ResponseEntity<?> emailComplete(@RequestParam String userEmail, @RequestParam String sendYn, @RequestParam String userSeq, HttpServletRequest request) throws Exception {

		ClassPathResource resource = new ClassPathResource("templates/registerEmailComplete.html");
		InputStream inputStream = resource.getInputStream();
		String mailData = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8)).lines().collect(Collectors.joining("\n"));

		JSONObject rewardJson = new JSONObject();
		rewardJson.put("userSeq", userSeq);
		String jsonString = AES256Encrypt.encrypt(rewardJson.toString());

		String targetUrl = CommonUtil.getHostAddress(request) + "/sch/user/registerEmailComplete.html?encData=" + jsonString;
		String receiver = userEmail.toString();
		String subject = "메타 이메일 본인인증";
		// String content = "hello 에이태그" + "<a href='"+ targetUrl +"'>"+ targetUrl +"</a>";
		
		mailData = mailData.replace("${{targetUrl}}", targetUrl);

		if(sendYn.equals("Y")){
			
			emailService.sendMail(receiver, subject, mailData);

			// emailService.sendMail(userEmail, "제목", mailData);
			return CommonResponse.statusResponse(HttpServletResponse.SC_OK);

		}else{
			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.TEXT_HTML);
			return new ResponseEntity<>(mailData, headers, HttpServletResponse.SC_OK);
		}
	}

	@GetMapping(value = "/userPwFind.api")
	@ApiOperation(value = "유저비번찾기 테스트", notes = "/test/userPwFind.api?userEmail=sjh@musicen.com&emailYn=Y emailYn이 N이면 html로리턴해서 테스트")
	public ResponseEntity<?> userPwFind(@RequestParam String userEmail, @RequestParam String emailYn, @RequestParam String userSeq, HttpServletRequest request) throws Exception {

		ClassPathResource resource = new ClassPathResource("templates/userPwFind.html");
		InputStream inputStream = resource.getInputStream();
		String mailData = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8)).lines().collect(Collectors.joining("\n"));

		JSONObject rewardJson = new JSONObject();
		rewardJson.put("userSeq", userSeq);
		String jsonString = AES256Encrypt.encrypt(rewardJson.toString());

		String targetUrl = CommonUtil.getHostAddress(request) + "/sch/user/userPwFind.html?encData=" + jsonString;
		String receiver = userEmail.toString();
		String subject = "메타 이메일 본인인증";
		// String content = "hello 에이태그" + "<a href='"+ targetUrl +"'>"+ targetUrl +"</a>";
		
		mailData = mailData.replace("${{targetUrl}}", targetUrl);

		if(emailYn.equals("Y")){
			
			emailService.sendMail(receiver, subject, mailData);

			// emailService.sendMail(userEmail, "제목", mailData);
			return CommonResponse.statusResponse(HttpServletResponse.SC_OK);

		}else{
			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.TEXT_HTML);
			return new ResponseEntity<>(mailData, headers, HttpServletResponse.SC_OK);
		}
	}*/

	@ApiOperation(value = "feed image 조회 ", notes = "feed Image를 반환합니다. 못찾은경우 기본 image를 반환합니다.")
	@GetMapping(value = "image/{imagename}", produces = MediaType.IMAGE_JPEG_VALUE)
	public ResponseEntity<byte[]> userSearch(@PathVariable("imagename") String imagename) throws Exception {
		// FILE_00000176
		String dd = uploadDir + imagename;
		Map<String,Object> rr = new LinkedHashMap<>();
		rr.put("fileSeq", imagename);

		Map<String, Object> rrr = fileService.fileMap(rr);

		String cour = (String) rrr.get("fileCours");
		
		
		System.out.println("999999999999");
		System.out.println(dd);
		InputStream imageStream = new FileInputStream(cour);
		byte[] imageByteArray = IOUtils.toByteArray(imageStream);
		imageStream.close();
		return new ResponseEntity<byte[]>(imageByteArray, HttpStatus.OK);
	}
		// 푸시 
		@PostMapping(value = "/testPush.api")
		@ApiOperation(value = "testPush 테스트", notes = "testPush 테스트 API")
		@ApiImplicitParam(name = "paramMap", value = "{\"user_email\":\"kjh@musicen.com\",\n"
				+ "\"title\":\"공지\",\n"
				+ "\"message\":\"안녕하세요 푸시보냅니다.\"}", example = "{\"user_email\":\"kjh@musicen.com\",\n"
						+ "\"title\":\"공지\",\n"
						+ "\"message\":\"안녕하세요 푸시보냅니다.\"}", required = true, dataTypeClass = String.class)
		public ResponseEntity<?> pushSend(@RequestBody Map<String, Object> paramMap, HttpServletRequest req)
				throws Exception {

			Map<String, Object> resultMap = commonService.selectMap("fcm.selectUserData", paramMap);

			if (ObjectUtils.isEmpty(resultMap)) {
				return CommonResponse.statusResponse(HttpServletResponse.SC_BAD_REQUEST, "토큰 정보가 없습니다.");
			}
			
		//	fcmService.sendTargetMessage((String)resultMap.get("deviceToken"),
				/*
				 * 	(String)paramMap.get("title"),
					(String)paramMap.get("message"),
					(String)resultMap.get("appOs"), resultMap);
					*/
			return CommonResponse.statusResponse(HttpServletResponse.SC_OK, resultMap);
		}
		
		// 알람 테스트 종료
 

	@GetMapping("/sdfdf")
	public ResponseEntity<?> sfs(@RequestBody Map<String, Object> paramMap) {
		//
		String a = "";
		String b = null;
		Map<String, Object> map = new CamelHashMap();
		map.put("a", 33);

		String c = (String) map.get("c");

		System.out.println(CommonUtil.isEmpty(a));
		System.out.println(CommonUtil.isEmpty(b));
		System.out.println(CommonUtil.isEmpty(c));

		return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
	}


	@PostMapping("/selectAlarmUserList")
	public ResponseEntity<?> wwsfs(@RequestBody Map<String, Object> paramMap) {
		List<Map<String, Object>> rere = commonService.selectList("user.selectAlarmUserList", paramMap);
		System.out.println(rere);

		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,rere);
	}



	@PostMapping("/genToken")
	public ResponseEntity<?> genToken(@RequestBody Map<String, Object> paramMap) {
		String userPk = (String) paramMap.get("userPk");
		String roles = (String) paramMap.get("roles");
		long tokenValidMilisecond = Long.parseLong((String) paramMap.get("tokenValidMilisecond")) ;
		System.out.println(tokenValidMilisecond);
		// String userPk = "USER_00000169";
		// String roles = "G";
		// long tokenValidMilisecond = 1000L * 60;

		String sec = Base64.getEncoder().encodeToString(secretKey.getBytes());
		System.out.println(sec);

		
		Claims claims = Jwts.claims().setSubject(userPk);
		claims.put("roles", roles);
		Date now = new Date();
		String token = Jwts.builder().setClaims(claims) // 데이터
				.setIssuedAt(now) // 토큰 발행일자
				.setExpiration(new Date(now.getTime() + tokenValidMilisecond)) // set Expire Time
				.signWith(SignatureAlgorithm.HS256, sec) // 암호화 알고리즘, secret값 세팅
				.compact(); // Token 생성


		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, token);
	}
	

	// // @RequestParam String paramMap
	// @GetMapping("/Test10mSemina")
	// public ResponseEntity<?> Test10mSemina(@RequestParam(defaultValue = "00:10:00") String reserveTime) throws Exception {
	// 	alarmService.insertSeminaReserveAlaram(reserveTime, "ALARM_PUSH_013");
	// 	return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
	// }

	@GetMapping("/Test10mLctre")
	public ResponseEntity<?> Test10mLctre(
			@RequestParam(defaultValue = "00:10:00") String min,
			@RequestParam(defaultValue = "00:10:00") String max,
			@RequestParam(defaultValue = "ALARM_PUSH_009") String alarmPushCd
		)
			throws Exception {
	//	alarmService.insertLctreReserveAlaram(min, max, alarmPushCd);

		// alarmService.insertLctreReserveAlaram("00:50:00", "01:00:00", "ALARM_PUSH_008");
		// alarmService.insertLctreReserveAlaram("00:00:00", "00:10:00", "ALARM_PUSH_009");
		// alarmService.insertSeminaReserveAlaram("00:50:00", "01:00:00", "ALARM_PUSH_012");
		// alarmService.insertSeminaReserveAlaram("00:00:00", "00:10:00", "ALARM_PUSH_013");
		// alarmService.insertCnsltReserveAlaram("00:50:00", "01:00:00", "ALARM_PUSH_016");
		// alarmService.insertCnsltReserveAlaram("00:00:00", "00:10:00", "ALARM_PUSH_017");
		// alarmService.insertExprnReserveAlaram("00:50:00", "01:00:00", "ALARM_PUSH_020");
		// alarmService.insertExprnReserveAlaram("00:00:00", "00:10:00", "ALARM_PUSH_021");

		return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
	}
	
	
	// @GetMapping("/Test10mExprn")
	// public ResponseEntity<?> Test10mExprn(@RequestParam(defaultValue = "00:10:00") String reserveTime)
	// 		throws Exception {
	// 	alarmService.insertExprnReserveAlaram(reserveTime, "ALARM_PUSH_017");
	// 	return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
	// }
	
		
	// @GetMapping("/Test10mCnslt")
	// public ResponseEntity<?> Test10mCnslt(@RequestParam(defaultValue = "00:10:00") String reserveTime)
	// 		throws Exception {
	// 	alarmService.insertCnsltReserveAlaram(reserveTime, "ALARM_PUSH_021");
	// 	return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
	// }
	
	@GetMapping("/insertLctreRcritAlaram")
	public ResponseEntity<?> insertLctreRcritAlaram(@RequestParam(defaultValue = "00:10:00") String reserveTime)
			throws Exception {
	//	alarmService.insertLctreRcritAlaram();
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
	}
	@GetMapping("/insertSeminaRcritAlaram")
	public ResponseEntity<?> insertSeminaRcritAlaram(@RequestParam(defaultValue = "00:10:00") String reserveTime)
			throws Exception {
	//	alarmService.insertSeminaRcritAlaram();
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
	}
	@GetMapping("/insertCnsltRcritAlaram")
	public ResponseEntity<?> insertCnsltRcritAlaram(@RequestParam(defaultValue = "00:10:00") String reserveTime)
			throws Exception {
	//	alarmService.insertCnsltRcritAlaram();
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
	}

	@GetMapping("/insertExprnRcritAlaram")
	public ResponseEntity<?> insertExprnRcritAlaram(@RequestParam(defaultValue = "00:10:00") String reserveTime)
			throws Exception {
		// alarmService.insertExprnRcritAlaram();
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
	}
	
	@GetMapping("/mailTest")
	public void werwer(@RequestParam String ti) throws Exception{
		Map<String, Object> rr = new CamelHashMap();
		rr.put("subject", ti);
		rr.put("title", "TITI");
		rr.put("contents", "contents contents contents contents contents");
		rr.put("targetUrl", "https://naver.com");
		rr.put("targetUrlMsg", "CLICK");
		// emailService.sendMail("siha159159@gmail.com", rr);
//		emailService.sendMail("thdwhdgus0624@daum.net", rr);
	}
}