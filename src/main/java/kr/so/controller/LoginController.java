package kr.so.controller;

import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import kr.so.configuration.security.JwtTokenProvider;
import kr.so.encrypt.AES256Encrypt;
import kr.so.encrypt.SHA256Encrypt;
import kr.so.service.CommonService;
import kr.so.service.LoginService;
import kr.so.util.CamelHashMap;
import kr.so.util.CommonResponse;
import kr.so.util.CommonUtil;
import kr.so.util.JSONObject;
import kr.so.util.UserParam;

@Api(tags = "01 Login", description = "로그인 & 회원가입")
@RestController
@RequestMapping("/login")
public class LoginController {

	private Logger log = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private JwtTokenProvider jwtTokenProvider;

	@Autowired
	CommonService commonService;

	@Autowired
	LoginService loginService;

	/**
	 *
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	@PostMapping(value = "/adminRegist.api")
	@ApiOperation(value = "관리자 회원가입", notes = "관리자 회원가입 후 이메일 전송")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{\r\n" + //
			"\t\"userEmail\": \"sjh@musicen.com\",\r\n" + //
			"\t\"userNm\": \"wer\",\r\n" + //
			"\t\"userNcnm\": \"대기해요\",\r\n" + //
			"\t\"userPassword\": \"eoqkr!@34\",\r\n" + //
			"\t\"userAuthor\": \"PR\",\r\n" + //
			"\t\"psitnNm\": \"텐진외국어대학교\",\r\n" + //
			"\t\"userInnb\": \"분자생물학과\", \r\n" + //
			"\t\"mbtlnum\": \"20221234\", \r\n" + //
			"\t\"brthdy\": \"860518\",\r\n" + //
			"\t\"sexdstn\": \"M\",\r\n" + //
			"\t\"profsr_hist\": \"어느중학교 어느대학교 어느교수\", \r\n" + //
			"\t\"proofImageCn\": \"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAHCAIAAAC6O5sJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAAuSURBVBhXY/iPA4AkVqxY0draCuHDAUgCKMrAgK4Vr1HIAG4sugTcWBxG/f8PALutmZ2F5MgiAAAAAElFTkSuQmCC\",\r\n"
			+ //
			"\t\"proflImageCn\": \"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAHCAIAAAC6O5sJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAAuSURBVBhXY/iPA4AkVqxY0draCuHDAUgCKMrAgK4Vr1HIAG4sugTcWBxG/f8PALutmZ2F5MgiAAAAAElFTkSuQmCC\", \r\n"
			+ //
			"\t\"proflColor\": \"#123456\",  \r\n" + //
			"\t\"lang\": \"K\",  \r\n" + //
			"\t\"qestnCode\": \"QUESTION_1\",\r\n" + //
			"\t\"qestnRspns\": \"김치찌개좋아\" ,\r\n" + //
			"\t\"stplatCode\": {\r\n" + //
			"\t\t\"POLICY_TERM\" : \"Y\",\r\n" + //
			"\t\t\"POLICY_MARKT\" : \"Y\",\r\n" + //
			"\t\t\"POLICY_MBER\" : \"N\"\r\n" + //
			"\t}\r\n" + //
			"}", example = "{\r\n" + //
					"\t\"userEmail\": \"sjh@musicen.com\",\r\n" + //
					"\t\"userNm\": \"wer\",\r\n" + //
					"\t\"userNcnm\": \"대기해요\",\r\n" + //
					"\t\"userPassword\": \"eoqkr!@34\",\r\n" + //
					"\t\"userAuthor\": \"PR\",\r\n" + //
					"\t\"psitnNm\": \"텐진외국어대학교\",\r\n" + //
					"\t\"userInnb\": \"분자생물학과\", \r\n" + //
					"\t\"mbtlnum\": \"20221234\", \r\n" + //
					"\t\"brthdy\": \"860518\",\r\n" + //
					"\t\"sexdstn\": \"M\",\r\n" + //
					"\t\"profsr_hist\": \"어느중학교 어느대학교 어느교수\", \r\n" + //
					"\t\"proofImageCn\": \"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAHCAIAAAC6O5sJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAAuSURBVBhXY/iPA4AkVqxY0draCuHDAUgCKMrAgK4Vr1HIAG4sugTcWBxG/f8PALutmZ2F5MgiAAAAAElFTkSuQmCC\",\r\n"
					+ //
					"\t\"proflImageCn\": \"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAHCAIAAAC6O5sJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAAuSURBVBhXY/iPA4AkVqxY0draCuHDAUgCKMrAgK4Vr1HIAG4sugTcWBxG/f8PALutmZ2F5MgiAAAAAElFTkSuQmCC\", \r\n"
					+ //
					"\t\"proflColor\": \"#123456\",  \r\n" + //
					"\t\"lang\": \"K\",  \r\n" + //
					"\t\"qestnCode\": \"QUESTION_1\",\r\n" + //
					"\t\"qestnRspns\": \"김치찌개좋아\" ,\r\n" + //
					"\t\"stplatCode\": {\r\n" + //
					"\t\t\"POLICY_TERM\" : \"Y\",\r\n" + //
					"\t\t\"POLICY_MARKT\" : \"Y\",\r\n" + //
					"\t\t\"POLICY_MBER\" : \"N\"\r\n" + //
					"\t}\r\n" + //
					"}")
	public ResponseEntity<?> adminRegist(@RequestBody Map<String, Object> paramMap, HttpServletRequest request)
			throws Exception {
		List<String> requiredList = Arrays.asList("userEmail", "userNm", "userNcnm", "userPassword", "userAuthor",
				"psitnNm", "userInnb", "mbtlnum", "proofImageCn", "proflImageCn", "proflColor", "lang",
				"qestnCode", "qestnRspns");
		if (!CommonUtil.validation(paramMap, requiredList)) {
			return null;
		}

		// email 기 가입자 체크
		paramMap.put("checkEntity", "userEmail");
		if (!ObjectUtils.isEmpty(commonService.selectMap("login.selectCheckExist", paramMap))) {
			return CommonResponse.statusResponse(HttpServletResponse.SC_BAD_REQUEST, "이미 가입된 email이 존재합니다.");
		}

		// 닉네임 중복 체크
		paramMap.put("checkEntity", "userNcnm");
		if (!ObjectUtils.isEmpty(commonService.selectMap("login.selectCheckExist", paramMap))) {
			return CommonResponse.statusResponse(HttpServletResponse.SC_BAD_REQUEST, "이미 가입된 닉네임이 존재합니다.");
		}

		paramMap.put("userPasswordEnc", SHA256Encrypt.encrypt(paramMap.get("userPassword").toString()));

		loginService.doSave(paramMap, request);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, paramMap);
	}

	/**
	 *
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	// @PostMapping(value = "/adminUpdate.api")
	// @ApiOperation(value = "관리자 데이터수정", notes = "관리자 데이터수정")
	// public ResponseEntity<?> adminUpdate(@RequestBody Map<String, Object>
	// paramMap) throws Exception {
	// return this.userRegist(paramMap);
	// }

	@PostMapping(value = "/userRegist.api")
	@ApiOperation(value = "일반회원 가입", notes = "일반회원 가입 으로 use_at을 N으로 설정하고 인증 이메일을 보냅니다 이메일확인후 use_at이 Y로 바뀌어야 회원가입이 완료됩니다")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{\r\n" + //
			"\t\"userEmail\": \"sjh@musicen.com\",\r\n" + //
			"\t\"userNm\": \"wer\",\r\n" + //
			"\t\"userNcnm\": \"대기해요\",\r\n" + //
			"\t\"userPassword\": \"eoqkr!@34\",\r\n" + //
			"\t\"userAuthor\": \"PR\",\r\n" + //
			"\t\"qestnRspns\": \"김치찌개좋아\" ,\r\n" + //
			"\t\"stplatCode\": {\r\n" + //
			"\t\t\"POLICY_TERM\" : \"Y\",\r\n" + //
			"\t\t\"POLICY_MARKT\" : \"Y\",\r\n" + //
			"\t\t\"POLICY_MBER\" : \"N\"\r\n" + //
			"\t}\r\n" + //
			"}", example = "{\r\n" + //
					"\t\"userEmail\": \"sjh@musicen.com\",\r\n" + //
					"\t\"userNm\": \"wer\",\r\n" + //
					"\t\"userNcnm\": \"대기해요\",\r\n" + //
					"\t\"userPassword\": \"eoqkr!@34\",\r\n" + //
					"\t\"userAuthor\": \"PR\",\r\n" + //
					"\t\"qestnRspns\": \"김치찌개좋아\" ,\r\n" + //
					"\t\"stplatCode\": {\r\n" + //
					"\t\t\"POLICY_TERM\" : \"Y\",\r\n" + //
					"\t\t\"POLICY_MARKT\" : \"Y\",\r\n" + //
					"\t\t\"POLICY_MBER\" : \"N\"\r\n" + //
					"\t}\r\n" + //
					"}")
	public ResponseEntity<?> userRegist(@RequestBody Map<String, Object> paramMap, HttpServletRequest request)
			throws Exception {
		List<String> requiredList = Arrays.asList("userEmail", "userNm", "userNcnm", "userPassword", "userAuthor",
				"stplatCode", "qestnCode", "qestnRspns", "userAuthor", "brthdy", "sexdstn", "psitnNm", "lang",
				"mbtlnum");
		if (!CommonUtil.validation(paramMap, requiredList)) {
			return null;
		}

		// email 기 가입자 체크
		paramMap.put("checkEntity", "userEmail");
		if (!ObjectUtils.isEmpty(commonService.selectMap("login.selectCheckExist", paramMap))) {
			return CommonResponse.statusResponse(HttpServletResponse.SC_BAD_REQUEST, "이미 가입된 email이 존재합니다.");
		}

		// 닉네임 중복 체크
		paramMap.put("checkEntity", "userNcnm");
		if (!ObjectUtils.isEmpty(commonService.selectMap("login.selectCheckExist", paramMap))) {
			return CommonResponse.statusResponse(HttpServletResponse.SC_BAD_REQUEST, "이미 가입된 닉네임이 존재합니다.");
		}

		// user_innb 기 가입자 체크
		paramMap.put("checkEntity", "userInnb");
		if (!ObjectUtils.isEmpty(commonService.selectMap("login.selectCheckExist", paramMap))) {
			return CommonResponse.statusResponse(HttpServletResponse.SC_BAD_REQUEST, "이미 가입된 고유번호가 존재합니다.");
		}

		paramMap.put("userPasswordEnc", SHA256Encrypt.encrypt(paramMap.get("userPassword").toString()));

		loginService.doSave(paramMap, request);

		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, paramMap);
	}

	@PostMapping(value = "/userUpgrade.api")
	@ApiOperation(value = "일반회원에서 수강회원 업그레이드신청", notes = "수강회원으로 업그레이드 한다")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{\r\n" + //
			"\t\"userAuthor\": \"PR\",\r\n" + //
			"\t\"brthdy\": \"860518\",\r\n" + //
			"\t\"sexdstn\": \"M\",\r\n" + //
			"\t\"psitnNm\": \"텐진외국어대학교\",\r\n" + //
			"\t\"userInnb\": \"분자생물학과\", \r\n" + //
			"\t\"lang\": \"K\",  \r\n" + //
			"\t\"mbtlnum\": \"20221234\", \r\n" + //
			"\t\"proofImageCn\": \"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAHCAIAAAC6O5sJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAAuSURBVBhXY/iPA4AkVqxY0draCuHDAUgCKMrAgK4Vr1HIAG4sugTcWBxG/f8PALutmZ2F5MgiAAAAAElFTkSuQmCC\",\r\n"
			+ //
			"\t\"proflImageCn\": \"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAHCAIAAAC6O5sJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAAuSURBVBhXY/iPA4AkVqxY0draCuHDAUgCKMrAgK4Vr1HIAG4sugTcWBxG/f8PALutmZ2F5MgiAAAAAElFTkSuQmCC\", \r\n"
			+ //
			"\t\"proflColor\": \"#123456\",  \r\n" + //
			"}", example = "{\r\n" + //
					"\t\"userAuthor\": \"PR\",\r\n" + //
					"\t\"brthdy\": \"860518\",\r\n" + //
					"\t\"sexdstn\": \"M\",\r\n" + //
					"\t\"psitnNm\": \"텐진외국어대학교\",\r\n" + //
					"\t\"userInnb\": \"분자생물학과\", \r\n" + //
					"\t\"lang\": \"K\",  \r\n" + //
					"\t\"mbtlnum\": \"20221234\", \r\n" + //
					"\t\"proofImageCn\": \"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAHCAIAAAC6O5sJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAAuSURBVBhXY/iPA4AkVqxY0draCuHDAUgCKMrAgK4Vr1HIAG4sugTcWBxG/f8PALutmZ2F5MgiAAAAAElFTkSuQmCC\",\r\n"
					+ //
					"\t\"proflImageCn\": \"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAHCAIAAAC6O5sJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAAuSURBVBhXY/iPA4AkVqxY0draCuHDAUgCKMrAgK4Vr1HIAG4sugTcWBxG/f8PALutmZ2F5MgiAAAAAElFTkSuQmCC\", \r\n"
					+ //
					"\t\"proflColor\": \"#123456\",  \r\n" + //
					"}")
	public ResponseEntity<?> userUpgrade(@UserParam Map<String, Object> paramMap) throws Exception {
		List<String> requiredList = Arrays.asList("userSeq", "userAuthor", "brthdy", "sexdstn", "psitnNm", "lang",
				"mbtlnum");
		if (!CommonUtil.validation(paramMap, requiredList)) {
			return null;
		}

		// user_innb 기 가입자 체크
		paramMap.put("checkEntity", "userInnb");
		if (!ObjectUtils.isEmpty(commonService.selectMap("login.selectCheckExist", paramMap))) {
			return CommonResponse.statusResponse(HttpServletResponse.SC_BAD_REQUEST, "이미 가입된 고유번호가 존재합니다.");
		}

		// user_author 제외한 수강회원 데이터 세팅
		commonService.update("login.userUpgrade", paramMap);

		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, paramMap);
	}

	@PostMapping(value = "/userUpgradeConfirm.api")
	@ApiOperation(value = "수강회원 신청 컨펌", notes = "관리자가 수강회원 신청을 확정한다, user_author_reqst에 저장했던값을 user_author에 이때 세팅한다")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{\r\n" + //
			"\t\"userSeq\": \"USER_00000127\",\r\n" + //
			"}", example = "{\r\n" + //
					"\t\"userSeq\": \"USER_00000127\",\r\n" + //
					"}")
	public ResponseEntity<?> userUpgradeConfirm(@RequestBody Map<String, Object> paramMap) throws Exception {
		List<String> requiredList = Arrays.asList("userSeq");
		if (!CommonUtil.validation(paramMap, requiredList)) {
			return null;
		}

		commonService.update("login.userUpgradeConfirm", paramMap);

		return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
	}

	@PostMapping(value = "/userEmailCheck.api")
	@ApiOperation(value = "회원가입 시 이메일 중복여부를 체크합니다.", notes = "회원가입 시 이메일 중복여부를 체크합니다. flag값이 true일시 중복된 이메일입니다")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{\r\n" + //
			"\t\"userEmail\": \"sjh@musicen.com\"\r\n" + //
			"\t\"exceptMe\": \"이값이 있다면 이 seq의 row를 제외하고 중복값 찾는다\"\r\n" + //
			"}", example = "{\r\n" + //
					"\t\"userEmail\": \"sjh@musicen.com\"\r\n" + //
					"\t\"exceptMe\": \"USER_00000100\"\r\n" + //
					"}")
	public ResponseEntity<?> emailCheck(@RequestBody Map<String, Object> paramMap) throws Exception {
		paramMap.put("checkEntity", "userEmail");
		Map<String, Object> checkMap = commonService.selectMap("login.selectCheckExist", paramMap);

		Map<String, Object> resultMap = new LinkedHashMap<String, Object>();
		if (checkMap.isEmpty()) {
			resultMap.put("flag", false);
			resultMap.put("msg", "사용가능");
		} else {
			resultMap.put("flag", true);
			resultMap.put("msg", "이미 존재합니다");

		}
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, resultMap);
	}

	@PostMapping(value = "/userNcnmCheck.api")
	@ApiOperation(value = "회원가입 시 닉네임 중복여부를 체크합니다.", notes = "회원가입 시 닉네임 중복여부를 체크합니다. flag값이 true일시 중복된 닉네임입니다")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{\r\n" + //
			"\t\"userNcnm\": \"게스트2\"\r\n" + //
			"\t\"exceptMe\": \"이값이 있다면 이 seq의 row를 제외하고 중복값 찾는다\"\r\n" + //
			"}", example = "{\r\n" + //
					"\t\"userNcnm\": \"게스트2\"\r\n" + //
					"\t\"exceptMe\": \"USER_00000100\"\r\n" + //
					"}")
	public ResponseEntity<?> userNcnmCheck(@RequestBody Map<String, Object> paramMap) throws Exception {

		paramMap.put("checkEntity", "userNcnm");
		Map<String, Object> checkMap = commonService.selectMap("login.selectCheckExist", paramMap);

		Map<String, Object> resultMap = new LinkedHashMap<String, Object>();
		if (checkMap.isEmpty()) {
			resultMap.put("flag", false);
			resultMap.put("msg", "사용가능");
		} else {
			resultMap.put("flag", true);
			resultMap.put("msg", "이미 존재합니다");
		}

		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, resultMap);
	}

	@PostMapping(value = "/userInnbCheck.api")
	@ApiOperation(value = "회원가입 시 고유번호 중복여부를 체크합니다.", notes = "회원가입 시 고유번호 중복여부를 체크합니다. flag값이 true일시 중복된 닉네임입니다")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{\r\n" + //
			"\t\"userInnb\": \"게스트2\"\r\n" + //
			"\t\"exceptMe\": \"이값이 있다면 이 seq의 row를 제외하고 중복값 찾는다\"\r\n" + //
			"}", example = "{\r\n" + //
					"\t\"userInnb\": \"게스트2\"\r\n" + //
					"\t\"exceptMe\": \"USER_00000100\"\r\n" + //
					"}")
	public ResponseEntity<?> userInnbCheck(@RequestBody Map<String, Object> paramMap) throws Exception {

		paramMap.put("checkEntity", "userInnb");
		Map<String, Object> checkMap = commonService.selectMap("login.selectCheckExist", paramMap);

		Map<String, Object> resultMap = new LinkedHashMap<String, Object>();
		if (checkMap.isEmpty()) {
			resultMap.put("flag", false);
			resultMap.put("msg", "사용가능");
		} else {
			resultMap.put("flag", true);
			resultMap.put("msg", "이미 존재합니다");
		}

		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, resultMap);
	}

	@PostMapping(value = "/login.api")
	@ApiOperation(value = "login(이메일/패스워드 방식)", notes = "로그인 후 <b>schToken</b> 값을 리턴합니다.\n"
			+ "토큰값은 <b>request header</b> 부의 <b>X-AUTH-TOKEN</b> 값에 넣어서 자격인증합니다.\n" + "Spring Security가 적용되어 있습니다.")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, 
			value = "{\r\n" + //
					"\t\"userEmail\":\"이용자이메일\",\r\n" + //
					"\t\"userPassword\":\"이용자 비밀번호\"\r\n" + //
					"}", 
			example = "{\r\n" + //
					"\t\"userEmail\":\"sch@musicen.com\",\r\n" + //
					"\t\"userPassword\":\"1234\"\r\n" + //
					"}")
	public ResponseEntity<?> login(@RequestBody Map<String, Object> paramMap) throws Exception {
		List<String> requiredList = Arrays.asList("userEmail", "userPassword");
		if (!CommonUtil.validation(paramMap, requiredList)) {
			return null;
		}

		Map<String, Object> loginMap = commonService.selectMap("login.selectLogin", paramMap);

		// 유저가없거나 패스워드가 없을경우
		if (ObjectUtils.isEmpty(loginMap) || ObjectUtils.isEmpty(loginMap.get("userPassword"))) {
			return CommonResponse.statusResponse(HttpServletResponse.SC_UNAUTHORIZED, "로그인 정보를 확인하세요.");
		}

		// 비밀번호가 틀렸을경우
		if (!loginMap.get("userPassword").equals(SHA256Encrypt.encrypt((String) paramMap.get("userPassword")))) {
			return CommonResponse.statusResponse(HttpServletResponse.SC_UNAUTHORIZED, "비밀번호가 일치하지않습니다.");
		}

		// userType 이 admin 이면서 실제유저권한이 SA, PR, AP 안에 속하지 않으면 로그인 시키지않음
		String[] fruits = {"SA", "PR", "AP"};
		if ("admin".equals(paramMap.get("userType")) && !Arrays.asList(fruits).contains(loginMap.get("userAuthor"))) {
			return CommonResponse.statusResponse(HttpServletResponse.SC_UNAUTHORIZED, "관리자만 로그인 가능합니다.");
		}

		// 탈퇴한 유저인경우
		if (loginMap.get("useAt").equals("D")) {
			return CommonResponse.statusResponse(HttpServletResponse.SC_UNAUTHORIZED, "탈퇴한 유저입니다.");
		}

		// 이메일인증을 받지않은 경우
		if (loginMap.get("useAt").equals("N")) {
			return CommonResponse.statusResponse(HttpServletResponse.SC_UNAUTHORIZED, "이메일 인증이 필요합니다.");
		}

		// useAt이 Y일 경우만 로그인
		if (!loginMap.get("useAt").equals("Y")) {
			return CommonResponse.statusResponse(HttpServletResponse.SC_UNAUTHORIZED, "관리자에게 문의하세요");
		}

		// 신고로 인해 로그인금지된경우
		paramMap.put("processAt", "F");
		List<Map<String, Object>> blclstList = commonService.selectList("sysManage.selectMberBlclstPaging", paramMap);
		if(blclstList.size() > 0){
			return CommonResponse.statusResponse(HttpServletResponse.SC_UNAUTHORIZED, "신고로 인해 로그인 금지된 유저입니다.");
		}

		paramMap.put("userSeq", loginMap.get("userSeq"));

		// 토큰 appOs 있을때만 update
		if(CommonUtil.isNotEmpty(paramMap.get("deviceToken")) && CommonUtil.isNotEmpty(paramMap.get("appOs"))){
			commonService.insert("login.setDeviceToken", paramMap);
		}

		// tb_user_login 체류시간테이블에 loginDt insert
		commonService.insert("login.loginDt", loginMap);

		// 로그인 검증 이후 메모리 loginSession세팅 후 데이터와 accessToken 리턴
		CommonUtil.loginSession.put((String) loginMap.get("userSeq"), loginMap);

		loginMap.remove("userPassword");

		String accessToken = jwtTokenProvider.createToken((String) loginMap.get("userSeq"),
				(String) loginMap.get("userAuthor"));
		loginMap.put("accessToken", accessToken);

		// login user 당월 등급( 당월등급 null일 때 '브론즈' )
		paramMap = commonService.selectMap("userManage.selectUserOneGrade", paramMap);
		loginMap.put("gradeNm", paramMap.get("gradCodeNm"));

		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, loginMap);
	}

	@PostMapping(value = "/userIdFind.api")
	@ApiOperation(value = "유저 아이디찾기", notes = "유저 아이디를 이름과 질문/답변으로 찾는다")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{\r\n" + //
			"\t\"userNm\": \"이름1\",\r\n" + //
			"\t\"qestnCode\": \"QUESTION_1\",\r\n" + //
			"\t\"qestnRspns\": \"대답\"\r\n" + //
			"}", example = "{\r\n" + //
					"\t\"userNm\": \"이름1\",\r\n" + //
					"\t\"qestnCode\": \"QUESTION_1\",\r\n" + //
					"\t\"qestnRspns\": \"대답\"\r\n" + //
					"}")
	public ResponseEntity<?> userIdFind(@RequestBody Map<String, Object> paramMap) throws Exception {
		List<String> requiredList = Arrays.asList("userNm", "qestnCode", "qestnRspns");
		if (!CommonUtil.validation(paramMap, requiredList)) {
			return null;
		}

		Map<String, Object> userMap = commonService.selectMap("login.userIdFind", paramMap);
		if (CommonUtil.isEmpty(userMap)) {
			return CommonResponse.statusResponse(HttpServletResponse.SC_BAD_REQUEST, "계정을 찾을수 없습니다");
		}
		;

		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, userMap.get("userEmail").toString());
	}

	@PostMapping(value = "/userPwFind.api")
	@ApiOperation(value = "유저 비밀번호찾기", notes = "유저 아이디를 받아서 비밀번호 변경 메일을 보낸다")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{\r\n" + //
			"\t\"userEmail\": \"sjh@musicen.com\"\r\n" + //
			"}", example = "{\r\n" + //
					"\t\"userEmail\": \"sjh@musicen.com\"\r\n" + //
					"}")
	public ResponseEntity<?> userPwFind(@RequestBody Map<String, Object> paramMap, HttpServletRequest request)
			throws Exception {
		List<String> requiredList = Arrays.asList("userEmail");
		if (!CommonUtil.validation(paramMap, requiredList)) {
			return null;
		}

		paramMap.put("checkEntity", "userEmail");

		Map<String, Object> userMap = commonService.selectMap("login.selectCheckExist", paramMap);
		if (CommonUtil.isEmpty(userMap)) {
			return CommonResponse.statusResponse(HttpServletResponse.SC_BAD_REQUEST, "계정을 찾을수 없습니다");
		}

		JSONObject jsonObject = new JSONObject();
		jsonObject.put("userSeq", userMap.get("userSeq"));
		String jsonString = AES256Encrypt.encrypt(jsonObject.toString());

		// 이메일 전송
		String targetUrl = CommonUtil.getHostAddress(request) + "/sch/user/userPwFind.html?encData=" + jsonString;
		String receiver = userMap.get("userEmail").toString();

		// 이메일 콘텐츠 생성
		Map<String, Object> mailData = new HashMap<>();
		mailData.put("subject", "메타 비밀번호변경");
		mailData.put("title", "메타 비밀번호변경");
		mailData.put("contents", "아래 링크는 비밀번호를 재설정할 수 있는 링크입니다.<br>링크를 클릭하여 비밀번호를 재설정해주세요.");
		mailData.put("targetUrl", targetUrl);
		mailData.put("targetUrlMsg", "변경하기");

		// emailService.sendMailNoTansaction(receiver, mailData);

		return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
	}

	@PostMapping(value = "/userUpdate.api")
	@ApiOperation(value = "유저 정보 업데이트", notes = "유저 정보를 수정 합니다")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{\r\n" + //
			"\t\"userSeq\": \"USER_00000148\",\r\n" + //
			"\t\"userNcnm\": \"닉네임123중복허용안됨\",\r\n" + //
			"\t\"qestnCode\": \"QUESTION_1\",\r\n" + //
			"\t\"qestnRspns\": \"대답1\",\r\n" + //
			"\r\n" + //
			"\t\"stplatCode\": {\r\n" + //
			"\t\t\"POLICY_TERM\": \"Y\",\r\n" + //
			"\t\t\"POLICY_MARKT\": \"Y\",\r\n" + //
			"\t\t\"POLICY_MBER\": \"Y\"\r\n" + //
			"\t}\r\n" + //
			"}\r\n" + //
			"",

			example = "{\r\n" + //
					"\t\"userSeq\": \"USER_00000148\",\r\n" + //
					"\t\"userNcnm\": \"닉네임123중복허용안됨ggg\",\r\n" + //
					"\t\"qestnCode\": \"QUESTION_1\",\r\n" + //
					"\t\"qestnRspns\": \"대답1\",\r\n" + //
					"\r\n" + //
					"\t\"stplatCode\": {\r\n" + //
					"\t\t\"POLICY_TERM\": \"Y\",\r\n" + //
					"\t\t\"POLICY_MARKT\": \"Y\",\r\n" + //
					"\t\t\"POLICY_MBER\": \"Y\"\r\n" + //
					"\t}\r\n" + //
					"}\r\n" + //
					"")
	public ResponseEntity<?> userUpdate(@UserParam Map<String, Object> paramMap) throws Exception {
		List<String> requiredList = Arrays.asList("userSeq");
		if (!CommonUtil.validation(paramMap, requiredList)) {
			return null;
		}

		// 닉네임 중복 체크
		paramMap.put("checkEntity", "userNcnm");
		paramMap.put("exceptMe", paramMap.get("userSeq"));
		if (!ObjectUtils.isEmpty(commonService.selectMap("login.selectCheckExist", paramMap))) {
			return CommonResponse.statusResponse(HttpServletResponse.SC_BAD_REQUEST, "이미 가입된 닉네임이 존재합니다.");
		}

		// 고유번호 중복체크
		paramMap.put("checkEntity", "userInnb");
		paramMap.put("exceptMe", paramMap.get("userSeq"));
		if (!ObjectUtils.isEmpty(commonService.selectMap("login.selectCheckExist", paramMap))) {
			return CommonResponse.statusResponse(HttpServletResponse.SC_BAD_REQUEST, "이미 가입된 고유번호가 존재합니다.");
		}

		loginService.doUpdate(paramMap);

		return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
	}

	@PostMapping(value = "/userDelete.api")
	@ApiOperation(value = "유저 삭제", notes = "유저 use_at을 N(삭제)로 플래그전환합니다")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{\r\n" + //
			"\t\"userPassword\": \"Eoqkr34@\"\r\n" + //
			"}", example = "{\r\n" + //
					"\t\"userPassword\": \"Eoqkr34@\"\r\n" + //
					"}")
	public ResponseEntity<?> userDelete(@UserParam Map<String, Object> paramMap) throws Exception {
		List<String> requiredList = Arrays.asList("userPassword");
		if (!CommonUtil.validation(paramMap, requiredList)) {
			return null;
		}

		Map<String, Object> userMap = commonService.selectMap("login.selectLoginMap", paramMap);

		if (!userMap.get("userPassword").equals(SHA256Encrypt.encrypt(paramMap.get("userPassword").toString()))) {
			return CommonResponse.statusResponse(HttpServletResponse.SC_BAD_REQUEST, "비밀번호가 일치하지 않습니다");
		}
		commonService.update("login.userDelete", paramMap);

		return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
	}

	@PostMapping(value = "/userPwChangeEncData.api")
	@ApiOperation(value = "비밀번호 찾기에서 유저 비밀번호 변경", notes = "유저 비밀번호 찾기에서 encData안에있는 userSeq기준으로 비밀번호를 변경한다")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{\r\n" + //
			"\t\"encData\": \"{\"userSeq\":\"USER_00000100\"} 값을 암호화하면 아래 예시가 됩니다 테스트(http://sjhtest.musicen.com/aes256.html) \",\r\n"
			+ //
			"\t\"userPassword\": \"Eoqkr!@34\"\r\n" + //
			"}", example = "{\r\n" + //
					"\t\"encData\": \"p7o2IbkXbnIJiUy8DIVLSL5wYYEL2a4C+QWFbn1Qwas=\",\r\n" + //
					"\t\"userPassword\": \"Eoqkr!@34\"\r\n" + //
					"}")
	public ResponseEntity<?> userPwChangeEncData(@RequestBody Map<String, Object> paramMap) throws Exception {

		String encData = AES256Encrypt.decrypt((String) paramMap.get("encData"));
		ObjectMapper mapper = new ObjectMapper();
		Map<String, Object> map = mapper.readValue(encData, Map.class);

		String userPasswordEnc = SHA256Encrypt.encrypt(paramMap.get("userPassword").toString());

		// {userSeq=USER_00000100}
		map.put("userPassword", userPasswordEnc);

		int result = commonService.update("login.userPasswordUpdate", map);
		if (result == 0) {
			return CommonResponse.statusResponse(HttpServletResponse.SC_BAD_REQUEST);
		}

		return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
	}

	@PostMapping(value = "/userPwChange.api")
	@ApiOperation(value = "유저 비밀번호 변경", notes = "유저 비밀번호를 변경한다")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{\r\n" + //
			"\t\"userPassword\": \"Eoqkr!@34\"\r\n" + //
			"}", example = "{\r\n" + //
					"\t\"userPassword\": \"Eoqkr!@34\"\r\n" + //
					"}")
	public ResponseEntity<?> userPwChange(@UserParam Map<String, Object> paramMap) throws Exception {

		String userSeq = ((Map<String, Object>) paramMap.get("user")).get("userSeq").toString();
		paramMap.put("userSeq", userSeq);

		String userPasswordEnc = SHA256Encrypt.encrypt(paramMap.get("userPassword").toString());
		paramMap.put("userPassword", userPasswordEnc);

		commonService.update("login.userPasswordUpdate", paramMap);

		return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
	}

	@PostMapping(value = "/logout.api")
	@ApiOperation(value = "로그아웃", notes = "체류시간테이블에 endDt 설정후 loginSession 메모리 정리")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class)
	public ResponseEntity<?> logout(@UserParam Map<String, Object> paramMap) throws Exception {

		// tb_user_login 체류시간테이블에 endDt 설정
		commonService.update("login.updateLoginDt", paramMap);

		// loginSession메모리 삭제
		String userSeq = ((Map<String, Object>) paramMap.get("user")).get("userSeq").toString();
		CommonUtil.loginSession.put(userSeq, null);

		return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
	}

	@PostMapping(value = "/policyList.api")
	@ApiOperation(value = "약관 조회", notes = "약관 안내 문구를 조회합니다.")
	public ResponseEntity<?> popupDetailData(@RequestBody Map<String, Object> paramMap) throws Exception {
		List<Map<String, Object>> policyList = commonService.selectList("login.policyList", paramMap);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, policyList);
	}

	@PostMapping(value = "/questionList.api")
	@ApiOperation(value = "질문 목록을 조회합니다.", notes = "질문 목록을 조회합니다.")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{}", example = "{}")
	public ResponseEntity<?> questionList(@RequestBody Map<String, Object> paramMap) throws Exception {
		List<Map<String, Object>> checkMap = commonService.selectList("login.questionList", paramMap);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, checkMap);
	}

	@PostMapping(value = "/refreshToken.api")
	@ApiOperation(value = "토큰 갱신", notes = "기존의 토큰을 이용해 신규토큰을 발급합니다. expireTime은 계산하지않음")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{\r\n" + //
			"\t\"accessToken\": \"eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNjg3MTMwMTY4LCJleHAiOjE2ODcxNjYxNjh9._9m_NliD12Ypw_NufF_TBMEndfi1tNrm-eHKYTeTZak\"\r\n"
			+ //
			"}", example = "{\r\n" + //
					"\t\"accessToken\": \"eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNjg3MTMwMTY4LCJleHAiOjE2ODcxNjYxNjh9._9m_NliD12Ypw_NufF_TBMEndfi1tNrm-eHKYTeTZak\"\r\n"
					+ //
					"}")
	public ResponseEntity<?> refreshToken(@RequestBody Map<String, Object> paramMap) {
		String oldToken = (String) paramMap.get("accessToken");

		try {
			String newToken = jwtTokenProvider.refreshToken(oldToken);
			paramMap.put("newToken", newToken);
			return CommonResponse.statusResponse(HttpServletResponse.SC_OK, paramMap);
		} catch (Exception e) {
			e.getStackTrace();
			return CommonResponse.statusResponse(HttpServletResponse.SC_UNAUTHORIZED, e.getMessage());
		}
	}

	@PostMapping(value = "/registerEmailComplete.api")
	@ApiOperation(value = "이메일인증", notes = "이메일을 통해받은 encData로 userSeq를 얻어서 useAt을 N->Y로 변경해 인증을 활성화합니다")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{\r\n" + //
			"\t\"encData\": \"{\"userSeq\":\"USER_00000100\"} 값을 암호화하면 아래 예시가 됩니다 테스트(http://sjhtest.musicen.com/aes256.html) \"\r\n"
			+ //
			"}", example = "{\r\n" + //
					"\t\"encData\": \"p7o2IbkXbnIJiUy8DIVLSL5wYYEL2a4C+QWFbn1Qwas=\"\r\n" + //
					"}")
	public ResponseEntity<?> registerEmailComplete(@RequestBody Map<String, Object> paramMap) throws Exception {
		String encData = AES256Encrypt.decrypt((String) paramMap.get("encData"));
		ObjectMapper mapper = new ObjectMapper();
		Map<String, Object> map = mapper.readValue(encData, Map.class);

		// 이미 이메일 인증을 한 유저인경우 처리
		Map<String, Object> tmpMap = new CamelHashMap();
		tmpMap.put("userSeq", map.get("userSeq"));
		map.put("user", tmpMap);
		List<Map<String, Object>> userList = commonService.selectList("login.selectLoginMap", map);
		if(userList.size() == 1){
			return CommonResponse.statusResponse(HttpServletResponse.SC_OK, "user_exists");
		}

		// 유저 use_at 업데이트 처리 {userSeq=USER_00000100}
		map.put("useAt", "Y");
		int result = commonService.update("login.useAtUpdate", map);
		if (result == 0) {
			return CommonResponse.statusResponse(HttpServletResponse.SC_BAD_REQUEST);
		}
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, map);
	}

	@PostMapping(value = "/appVerChk.api")
	@ApiOperation(value = "최신버전정보 조회", notes = "최신 앱버전 정보를 조회합니다.")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{}", example = "{}")
	public ResponseEntity<?> appVerChk(@RequestBody Map<String, Object> paramMap) throws Exception {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectMap("login.appVerChk", paramMap));
	}

}
