package kr.so.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import kr.so.configuration.security.JwtTokenProvider;
import kr.so.mvc.service.CommonService;
import kr.so.service.ConsultService;
import kr.so.service.FileService;
import kr.so.service.LctreService;
import kr.so.service.UserManageService;
import kr.so.util.CamelHashMap;
import kr.so.util.CommonResponse;
import kr.so.util.CommonUtil;
import kr.so.util.JSONObject;
import kr.so.util.UserParam;

@Api(tags = " Lctre - 강의")
@RestController
@RequestMapping("/lctreController")
public class LctreController {

	private Logger log = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private JwtTokenProvider jwtTokenProvider;

	
	@Autowired
	CommonService commonService;

	@Autowired
	LctreService lctreService;

	@Autowired
	ConsultService consultService;

	@Autowired
	FileService fileService;

	@Autowired
	UserManageService userManageService;

	@PostMapping(value = "/list.api")
	@ApiOperation(value = "강의 & 세미나 리스트 조회", notes = "강의 & 세미나 리스트 조회")
	public ResponseEntity<?> CnsltAndExprnSelect(@RequestBody Map<String, Object> paramMap) throws Exception {

		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectPaging("Consult.cnsltList", paramMap));
	}

	@PostMapping(value = "/questionSelect.api")
	@ApiOperation(value = "질문 목록을 조회합니다.", notes = "질문 목록을 조회합니다.")
	public ResponseEntity<?> questionSelect(@RequestBody Map<String, Object> paramMap) throws Exception {
		List<Map<String, Object>> checkMap = commonService.selectList("login.questionSelect", paramMap);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, checkMap);
	}

	/**
	 * 강의 List
	 *
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	@PostMapping(value = "/selectLctreList.api")
	@ApiOperation(value = "모든 강의 리스트 출력", notes = "현재 DB에 저장된 모든 강의 리스트를 출력합니다.")
	public ResponseEntity<?> selectLctreList(@RequestBody Map<String, Object> paramMap) throws Exception {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectPaging("sysLctre.selectLctreListPaging", paramMap));
	}

	/**
	 * 강의 Insert
	 */
	@PostMapping(value = "/insertLctre.api")
	@ApiOperation(value = "강의 INSERT", notes = "강의를 등록합니다.")
	@ApiImplicitParams({
			@ApiImplicitParam(name = "paramMap", required = true, paramType = "formData", dataTypeClass = JSONObject.class) })
	public ResponseEntity<?> insertLctre(@UserParam Map<String, Object> paramMap) throws Exception {
		lctreService.insertLctre(paramMap);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
	}

	/**
	 * 강의
	 *
	 * @param paramMap 강의 시퀀스(lctreSeq) 들어있는 맵
	 * @return Map<String, Object> resultMap 강의테이블, 강의키워드 테이블
	 * @throws Exception
	 */
	@PostMapping(value = "/selectLctre.api")
	@ApiOperation(value = "강의테이블, 강의일정테이블, 강의키워드 테이블 출력", notes = "현재 DB에 저장된 강의내용을 출력합니다.")
	public ResponseEntity<?> selectLctre(@RequestBody Map<String, Object> paramMap, HttpServletRequest req) throws Exception {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				lctreService.selectLctre("sysLctre.selectLctre", paramMap));
	}

	/**
	 * 로그인 정보
	 *
	 * @return Map<String, Object> resultMap 로그인 정보
	 * @throws Exception
	 */
	@PostMapping(value = "/selectUserInfo.api")
	@ApiOperation(value = "로그인 정보 출력", notes = "로그인한 유저의 정보를 출력합니다.")
	public ResponseEntity<?> selectUserInfo(@RequestBody  Map<String, Object> paramMap, HttpServletRequest req) throws Exception {
		Map<String, Object> resultMap = CommonUtil.loginSession
				.get(jwtTokenProvider.getUserPk(jwtTokenProvider.resolveToken(req)));
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, resultMap);
	}

	/**
	 * 강의일정 List
	 *
	 * @throws Exception
	 */
	@PostMapping(value = "/selectLctrePlanList.api")
	@ApiOperation(value = "강의일정 목록", notes = "해당 강의의 강의일정을 조회합니다.")
	@ApiImplicitParam(name = "paramMap", value = "강의 시퀀스(lctreSeq) 들어있는 맵", dataTypeClass = Map.class)
	public ResponseEntity<?> selectUserGradeList(@RequestBody Map<String, Object> paramMap) throws Exception {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectList("sysLctre.selectLctrePlanList", paramMap));
	}

	/**
	 * 강의 수강생 List
	 *
	 * @throws Exception
	 */
	@PostMapping(value = "/selectLctreUserList.api")
	@ApiOperation(value = "강의 수강생 목록", notes = "해당 강의의 수강생들을 조회합니다.")
	@ApiImplicitParam(name = "paramMap", value = "강의 시퀀스(lctreSeq) 들어있는 맵", dataTypeClass = Map.class)
	public ResponseEntity<?> selectLctreUserList(@RequestBody Map<String, Object> paramMap) throws Exception {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectList("sysLctre.selectLctreUserList", paramMap));
	}

	/**
	 * 강의 Update
	 */
	@PostMapping(value = "/updateLctre.api")
	@ApiOperation(value = "강의 UPDATE", notes = "강의를 수정합니다.")
	@ApiImplicitParams({
			@ApiImplicitParam(name = "paramMap", required = true, paramType = "formData", dataTypeClass = JSONObject.class) })
	public ResponseEntity<?> updateLctre(@UserParam Map<String, Object> paramMap) throws Exception {
		log.debug("paramMap의 alarmArray => " + paramMap.get("alarmArray"));

		// 강의 폐강 알람
		if(CommonUtil.isNotEmpty(paramMap.get("alarmArray"))){

			List<Map<String, Object>> userList = commonService.selectList("sysLctre.selectLctreUserList", paramMap);
			List<String> userSeqList = new ArrayList<>();
			for (Map<String, Object> applyUser : userList) {
				if (applyUser.containsKey("atnlcUserSeq")) {
					userSeqList.add(applyUser.get("atnlcUserSeq").toString());
				}
			}
			//  paramMap.get("clctreCode") PERSONAL_REASON 개인사유
			//
			/*alarmService.insertLctreCancelalarm(
				(List<String>) paramMap.get("alarmArray"), // Arrays.asList("A", "P"),
				userSeqList, //Arrays.asList("USER_00000132"),
				(String) paramMap.get("lctreNm") + "",
				(String) paramMap.get("clctreDc") + ""
			);
			*/
		}

		int result = commonService.update("sysLctre.updateLctre", paramMap);
		Map<String, Object> resultMap = new HashMap<>();
		resultMap.put("result", result);
		if (result == -1) {
			return CommonResponse.statusResponse(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		}
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, resultMap);
	}

	@PostMapping(value = "/getCurrentUserListExcel.api")
	@ApiOperation(value = "현재 수강신청자 다운로드", notes = "현재 수강신청자 성명 및 사용자번호 엑셀 다운로드")
	@ApiImplicitParams({
			@ApiImplicitParam(name = "paramMap", value = "{'lctreUserArray': lctreUserArray}", example = "{'lctreUserArray', {'김기열(000032)',''강한나(000033)' }}", required = true, dataTypeClass = String.class) })
	public void getCurrentUserListExcel(@RequestBody Map<String, Object> paramMap, HttpServletResponse response)
			throws Exception {
		List<Map<String, Object>> datas = new ArrayList<>();

		Map<String, Object> userListMap = new CamelHashMap();
		userListMap.put("headers", new String[] { "순번", "이름", "소속" });

		ArrayList<String> lctreUserList = (ArrayList<String>) paramMap.get("lctreUserArray");

		List<Map<String, Object>> listMap = new ArrayList<>();
		lctreUserList.forEach((el) -> {
			int index = 1;
			String userSeq = el.substring(el.indexOf("(") + 1, el.indexOf(")"));
			String userName = el.substring(0, el.indexOf("("));
			Map<String, Object> lctreUserMap = new HashMap<>();
			lctreUserMap.put("이름", userName);
			lctreUserMap.put("소속", userSeq);
			listMap.add(lctreUserMap);
		});

		userListMap.put("list", listMap);
		datas.add(userListMap);
		//excelService.exportDataToExcel("현재 수강신청자 현황", datas, true, response);
	}

	@PostMapping(value = "/getCurrentParticipantsListExcel.api")
	@ApiOperation(value = "현재 수업참여자 다운로드", notes = "현재 수업참여자 성명 및 사용자번호 엑셀 다운로드")
	@ApiImplicitParams({
			@ApiImplicitParam(name = "paramMap", value = "{'lctreParticipantUserArray': lctreParticipantUserArray}", example = "{'lctreParticipantUserArray', {'김기열(000032)',''강한나(000033)' }}", required = true, dataTypeClass = String.class) })
	public void getCurrentParticipantsListExcel(@RequestBody Map<String, Object> paramMap, HttpServletResponse response)
			throws Exception {
		List<Map<String, Object>> datas = new ArrayList<>();

		Map<String, Object> userListMap = new CamelHashMap();
		userListMap.put("headers", new String[] { "순번", "이름", "소속" });

		ArrayList<String> lctreParticipantUserList = (ArrayList<String>) paramMap.get("lctreParticipantUserArray");
		List<Map<String, Object>> listMap = new ArrayList<>();

		lctreParticipantUserList.forEach((el) -> {
			int index = 1;
			String userSeq = el.substring(el.indexOf("(") + 1, el.indexOf(")"));
			String userName = el.substring(0, el.indexOf("("));
			Map<String, Object> lctreUserMap = new HashMap<>();
			lctreUserMap.put("이름", userName);
			lctreUserMap.put("소속", userSeq);
			listMap.add(lctreUserMap);
		});

		userListMap.put("list", listMap);
		datas.add(userListMap);
		//excelService.exportDataToExcel("현재 수업참여자 현황", datas, true, response);
	}

	/**
	 * 강의 Delete
	 *
	 * @param paramMap 강의 시퀀스(lctreSeq) 들어있는 맵
	 */
	@PostMapping(value = "/deleteLctre.api")
	@ApiOperation(value = "강의 DELETE", notes = "강의를 DB에서 완전히 삭제합니다.")
	@ApiImplicitParams({
			@ApiImplicitParam(name = "paramMap", required = true, paramType = "formData", example = "{'lctreSeq': 'LCTRE_00000088'}", dataTypeClass = JSONObject.class) })
	public ResponseEntity<?> deleteLctre(@RequestBody Map<String, Object> paramMap) throws Exception {
		lctreService.deleteLctre(paramMap);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
	}

	/**
	 * 강의테이블, 강의일정테이블, 강의키워드테이블 Update
	 */
	@PostMapping(value = "/updateLctreAndLctreFxAndLctreKwrd.api")
	@ApiOperation(value = "강의테이블, 강의일정테이블, 강의키워드테이블 UPDATE", notes = "강의테이블, 강의일정테이블, 강의키워드테이블을 수정합니다.")
	@ApiImplicitParams({
			@ApiImplicitParam(name = "paramMap", required = true, paramType = "formData", dataTypeClass = JSONObject.class) })
	public ResponseEntity<?> updateLctreAndLctreFxAndLctreKwrd(@UserParam Map<String, Object> paramMap)
			throws Exception {
		lctreService.updateLctreAndLctreFxAndLctreKwrd(paramMap);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
	}

	/**
	 * 강의운영 List
	 *
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	@PostMapping(value = "/selectLctreOperateList.api")
	@ApiOperation(value = "모든 강의운영 리스트 출력", notes = "현재 DB에 저장된 모든 강의운영 리스트를 출력합니다. => 확정된 강의가 운영 리스트이다.")
	public ResponseEntity<?> selectLctreOperateList(@UserParam Map<String, Object> paramMap) throws Exception {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectPaging("sysLctre.selectLctreOperateListPaging", paramMap));
	}

	/**
	 * 회원 정보 받아오기
	 *
	 * @param paramMap UserParam에서 userSeq 받아옴
	 * @return Map<String, Object> resultMap 이용자 테이블
	 * @throws Exception
	 */
	@PostMapping(value = "/selectUser.api")
	@ApiOperation(value = "회원 테이블 출력", notes = "현재 DB에 저장된 이용자 내용을 출력합니다.")
	public ResponseEntity<?> selectUser(@UserParam Map<String, Object> paramMap) throws Exception {
		Map<String, Object> userMap = (Map<String, Object>) paramMap.get("user");
		paramMap.put("userSeq", userMap.get("userSeq").toString());
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				lctreService.selectLctre("user.selectUserList", paramMap));
	}

	/**
	 * 강좌
	 *
	 * @param paramMap 강의 시퀀스(lctreSeq), 강좌번호(lctreSn) 들어있는 맵
	 * @return Map<String, Object> resultMap 강의일정테이블, 강의테이블, 강의키워드테이블, 이용자테이블,
	 *         강의수강테이블, 강의출석테이블
	 * @throws Exception
	 */
	@PostMapping(value = "/selectLctreFx.api")
	@ApiOperation(value = "강의일정테이블, 강의테이블, 강의키워드테이블, 이용자테이블, 강의수강테이블, 강의출석테이블 출력", notes = "현재 DB에 저장된 강좌내용을 출력합니다.")
	public ResponseEntity<?> selectLctreFx(@RequestBody Map<String, Object> paramMap) throws Exception {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectMap("sysLctre.selectLctreFx", paramMap));
	}

	/**
	 * 강좌 참여자 List
	 *
	 * @throws Exception
	 */
	@PostMapping(value = "/selectLctreFxParticipantsList.api")
	@ApiOperation(value = "강좌 참여자 목록", notes = "해당 강좌의 참여자들을 조회합니다.")
	@ApiImplicitParam(name = "paramMap", value = "강의 시퀀스(lctreSeq), 강좌 시퀀스(lctreSn) 들어있는 맵", dataTypeClass = Map.class)
	public ResponseEntity<?> selectLctreFxParticipantsList(@RequestBody Map<String, Object> paramMap) throws Exception {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectList("sysLctre.selectLctreFxParticipantsList", paramMap));
	}

	/**
	 * 강의일정 Update
	 */
	@PostMapping(value = "/updateLctreFx.api")
	@ApiOperation(value = "강의일정 UPDATE", notes = "강의일정을 수정합니다.")
	@ApiImplicitParams({
			@ApiImplicitParam(name = "paramMap", required = true, paramType = "formData", dataTypeClass = JSONObject.class) })
	public ResponseEntity<?> updateLctreFx(@UserParam Map<String, Object> paramMap) throws Exception {
		if (paramMap.get("rlctreNtcnArray") != null) {
			ArrayList<String> rlctreNtcnList = (ArrayList<String>) paramMap.get("rlctreNtcnArray");
			String rlctreNtcnStr = String.join(",", rlctreNtcnList);
			paramMap.put("rlctreNtcnStr", rlctreNtcnStr);

			// 개별강좌 휴강 알람처리
			List<Map<String, Object>> userList = commonService.selectList("sysLctre.selectLctreUserList", paramMap);
			List<String> userSeqList = new ArrayList<>();
			for (Map<String, Object> applyUser : userList) {
				if (applyUser.containsKey("atnlcUserSeq")) {
					userSeqList.add(applyUser.get("atnlcUserSeq").toString());
				}
			}
			//  paramMap.get("rlctreCode") SCHOOL_EVENT 학교행사, ...
			//alarmService.insertLctreCloseAlarm(
			
			/*(List<String>) paramMap.get("rlctreNtcnArray"), // Arrays.asList("A", "P")
				userSeqList, //Arrays.asList("USER_00000132"),
				(String) paramMap.get("lctreNm") + " " + (String) paramMap.get("lctreSj"), // 강좌 제목
				(String) paramMap.get("rlctreDc") // 휴강 이유 msg
			);
			*/
		}
		commonService.update("sysLctre.updateLctreFx", paramMap);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
	}

	/**
	 * 강의 수강신청 취소
	 * @Param paramMap : {"lctreSeq":"LCTRE_00000091", "userSeq": "USER_00000132"} require
	 */
	@PostMapping(value = "/updateLctreAtnlc.api")
	@ApiOperation(value = "교수나 관리자가 강의 수강신청을 취소반려 합니다.", notes = "강의수강 테이블에 데이터를 수정합니다.")
	public ResponseEntity<?> updateLctreAtnlc(@UserParam Map<String, Object> paramMap, HttpServletRequest req) throws Exception {
		commonService.insert("sysLctre.updateLctreAtnlc", paramMap);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
	}

	/**
	 * 현재 강좌 정보 조회
	 * @Param paramMap : {"lctreSeq":"LCTRE_00000091"} require
	 */
	@PostMapping(value = "/selectCurrentLctreFx.api")
	@ApiOperation(value = "현재 강좌 정보 조회", notes = "사용자의 수강신청한 강좌 중 금일의 강좌를 조회합니다.")
	public ResponseEntity<?> selectCurrentLctreFx(@UserParam Map<String, Object> paramMap) throws Exception {
		Map<String, Object> resultMap = commonService.selectMap("sysLctre.selectCurrentLctreFx", paramMap);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, resultMap);
	}

	/**
	 * 일정표 List
	 *
	 * @throws Exception
	 */
	@PostMapping(value = "/selectUserPlanList.api")
	@ApiOperation(value = "일정 목록 (강의, 세미나, 상담, 체험)", notes = "해당 유저의 일정을 조회합니다.")
	public ResponseEntity<?> selectUserPlanList(@UserParam Map<String, Object> paramMap) throws Exception {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, lctreService.selectUserPlanList(paramMap));
	}
}
