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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import kr.so.configuration.security.JwtTokenProvider;
import kr.so.mvc.service.CommonService;
import kr.so.service.ExperienceService;
import kr.so.service.FileService;
import kr.so.util.CamelHashMap;
import kr.so.util.CommonResponse;
import kr.so.util.CommonUtil;
import kr.so.util.UserParam;

@Api(tags = "06 Experience - 체험예약 ")
@RestController
@RequestMapping("/experience")
public class ExperienceController {

	private Logger log = LoggerFactory.getLogger(this.getClass());

	@Autowired
	CommonService commonService;

	@Autowired
	FileService fileService;

	@Autowired
	JwtTokenProvider jwtTokenProvider;

	@Autowired
	ExperienceService experienceService;

	@PostMapping(value = "/excrtPosbleList.api")
	@ApiOperation(value = "갤러리 등록할때 사용되는 체험 종류랑 체험 날짜 선택 조회", notes = "갤러리 등록할때 사용되는 체험 종류랑 체험 날짜 선택 불러옵니다.")
	@ApiImplicitParam(name = "paramMap", value = "갤러리리스트 조회", dataTypeClass = String.class)
	public ResponseEntity<?> excrtPosbleList(@RequestBody Map<String, Object> paramMap) throws Exception {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectList("Experience.excrtPosbleList", paramMap));
	}

	@PostMapping(value = "/deleteExcrt.api")
	@ApiOperation(value = "갤러리 삭제하기", notes = "\"excrtSeq\": \"EXCRT_00000010\"")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class)
	public ResponseEntity<?> deleteExcrt(@UserParam Map<String, Object> paramMap) throws Exception {
		experienceService.deleteExcrt(paramMap);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
	}

	@PostMapping(value = "/updateExcrt.api")
	@ApiOperation(value = "갤러리 수정하기", notes = "선택한 갤러리의 상세정보를 불러옵니다.")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class)
	public ResponseEntity<?> updateExcrt(
			@RequestPart(value = "uploadFile", required = false) MultipartFile[] uploadFile,
			@RequestParam(value = "paramMap", required = true) Map<String, Object> paramMap) throws Exception {

		experienceService.updateExcrt(uploadFile, paramMap);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
	}

	@PostMapping(value = "/insertExcrt.api")
	@ApiOperation(value = "갤러리 등록하기", notes = "선택한 갤러리의 상세정보를 불러옵니다. {\r\n" + //
			"\t\"exprnKndCode\": \"T\",\r\n" + //
			"\t\"exprnDt\":\"12341234\",\r\n" + //
			"\t\"exprnNm\":\"\uD5E4\uC774\uD5E4\uC774\",\r\n" + //
			"\t\"sj\":\"\uC81C\uBAA9\"\r\n" + //
			"}")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class)
	public ResponseEntity<?> insertExcrt(
			@RequestPart(value = "uploadFile", required = false) MultipartFile[] uploadFile,
			@RequestParam(value = "paramMap", required = true) Map<String, Object> paramMap, HttpServletRequest req)
			throws Exception {
		Map<String, Object> sessionMap = CommonUtil.loginSession
				.get(jwtTokenProvider.getUserPk(jwtTokenProvider.resolveToken(req)));
		paramMap.put("user", sessionMap);

		fileService.fileRegist(uploadFile, paramMap);
		commonService.insert("Experience.insertExcrt", paramMap);

		return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
	}

	/**
	 * 갤러리 Detail
	 */
	@PostMapping(value = "/selectExtfcDetail.api")
	@ApiOperation(value = "갤러리 상세보기", notes = "선택한 갤러리의 상세정보를 불러옵니다.")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class)
	public ResponseEntity<?> selectExtfcDetail(@UserParam Map<String, Object> paramMap) throws Exception {
		Map<String, Object> resultMap = commonService.selectMap("Experience.selectExtfcDetail", paramMap);
		paramMap.put("fileSeq", resultMap.get("imageFileSeq"));
		resultMap.put("file", fileService.fileList(paramMap));
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, resultMap);
	}

	@PostMapping(value = "/selectExtfcListPaging.api")
	@ApiOperation(value = "갤러리 리스트 조회", notes = "갤러리 목록을 불러옵니다.")
	@ApiImplicitParam(name = "paramMap", value = "갤러리리스트 조회", dataTypeClass = String.class)
	public ResponseEntity<?> extfcListPaging(@RequestBody Map<String, Object> paramMap) throws Exception {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectPaging("Experience.extfcListPaging", paramMap));
	}

	@PostMapping(value = "/selectExperienceList.api")
	@ApiOperation(value = "체험예약 개설 리스트 조회", notes = "교수상당 목록을 불러옵니다.")
	@ApiImplicitParam(name = "paramMap", value = "체험예약 시퀀스(exprnSeq) 들어있는 맵", dataTypeClass = Map.class)
	public ResponseEntity<?> SelectExprn(@RequestBody Map<String, Object> paramMap) throws Exception {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectPaging("Experience.selectExperienceListPaging", paramMap));
	}

	@PostMapping(value = "/selectExperienceTimeList.api")
	@ApiOperation(value = "체험예약 개설 리스트 조회", notes = "list 조회")
	@ApiImplicitParam(name = "paramMap", value = "체험예약 시퀀스와 순번을 조회", dataTypeClass = String.class)
	public ResponseEntity<?> selectExperienceTimeList(@RequestBody Map<String, Object> paramMap) throws Exception {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectList("Experience.selectExperienceListPaging", paramMap));
	}

	@PostMapping(value = "/getExprnProposal.api")
	@ApiOperation(value = "다른 체험제안 리스트 조회", notes = "다른 체험제안 목록을 불러옵니다.")
	@ApiImplicitParam(name = "paramMap", value = "다른 체험 제안 분류코드(bbs_se='O' or 'F')가 포함된 맵", dataTypeClass = Map.class)
	public ResponseEntity<?> getExprnProposal(@RequestBody Map<String, Object> paramMap) throws Exception {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				experienceService.getExprnProposal("Experience.getExprnProposalList", paramMap));
	}

	@PostMapping(value = "/getExprnProposalList.api")
	@ApiOperation(value = "", notes = "")
	@ApiImplicitParam(name = "paramMap", value = "", dataTypeClass = Map.class)
	public ResponseEntity<?> getExprnProposalList(@RequestBody Map<String, Object> paramMap) throws Exception {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectPaging("Experience.getOtherExprnProposalListPaging", paramMap));
	}

	/**
	 * 체험 예약 취소
	 *
	 * @throws Exception
	 */
	@PostMapping(value = "/updateExperienceCancl.api")
	@ApiOperation(value = "", notes = "")
	public ResponseEntity<?> updateExperienceCancl(@UserParam Map<String, Object> paramMap) throws Exception {

		if (CommonUtil.isNotEmpty(paramMap.get("canclNtcnArray"))) {
			String canclNtcnList = (String) paramMap.get("canclNtcnArray");
			List<Map<String, Object>> applyUserList = commonService
					.selectList("Experience.selectExperienceRegistranterListPaging", paramMap);

			// 교수상담 취소 알람 처리
			Map<String, Object> cnsltMap = commonService.selectMap("Experience.selectExperienceOperate", paramMap);
			List<String> userSeqList = new ArrayList<>();
			for (Map<String, Object> applyUser : applyUserList) {
				if (applyUser.containsKey("exprnUserSeq")) {
					userSeqList.add(applyUser.get("exprnUserSeq").toString());
				}
			}

			/*
			alarmService.insertExprnCancelAlarm(Arrays.asList(canclNtcnList.split(",")), userSeqList, // Arrays.asList("USER_00000132"),
					(String) cnsltMap.get("exprnNm") + " " + (String) paramMap.get("exprnSn") + "회", // cnslt_place_nm
					(String) paramMap.get("canclDc"));
		*/
		}
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectMap("Experience.updateExperienceCancl", paramMap));
	}

	@PostMapping(value = "/insertExprn.api")
	@ApiOperation(value = "experience 공통 UPSERT", notes = "exprn(체험예약, 체험신청 공통사용하는 insert) ")
	@ApiImplicitParam(name = "paramMap", value = "체험예약 시퀀스(exprnSeq) 들어있는 맵", dataTypeClass = Map.class)
	public ResponseEntity<?> insertexprn(@UserParam Map<String, Object> paramMap) {
		experienceService.insertExprn(paramMap);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
	}

	@PostMapping(value = "/insertOtherProposal.api")
	@ApiOperation(value = "다른 체험 제안하기", notes = "다른 체험 제안하기 Front api insert")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{\r\n" + //
			"\t\"bbsSeq\": \"fn_nextval('BBS')\",\r\n" + //
			"\t\"bbsSj\": \"다른 체험 제안하기 제목\",\r\n" + //
			"\t\"bbsCn\": \"다른 체험 제안하기 내용\",\r\n" + //
			"\t\"useAt\": \"비밀글여부(일반글:Y, 비밀글:S, default : 'Y' )\",\r\n" + //
			"\t\"bbsSe\": \"게시판구분 (다른 체험 제안하기 카테고리구분(F:신규체험,O:기존체험))\"\r\n" + //
			"}", example = "{\r\n" + //
					"\t\"bbsSeq\": \"\",\r\n" + //
					"\t\"bbsSj\": \"제목 입니다.\",\r\n" + //
					"\t\"bbsCn\": \"내용 입니다.\",\r\n" + //
					"\t\"useAt\": \"Y\",\r\n" + //
					"\t\"bbsSe\": \"F|O\"\r\n" + //
					"}")
	public ResponseEntity<?> insertOtherProposal(@UserParam Map<String, Object> paramMap) {
		if (CommonUtil.isEmpty(paramMap.get("bbsCode"))) {
			paramMap.put("bbsCode", "EXPRN");
		}
		commonService.insert("Experience.insertOtherProposal", paramMap);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
	}

	@PostMapping(value = "/selectExprn.api")
	@ApiOperation(value = "체험예약테이블, 체험예약일정테이블, 체험예약키워드 테이블 출력", notes = "현재 DB에 저장된 체험예약내용을 출력합니다.")
	@ApiImplicitParam(name = "paramMap", value = "체험예약 시퀀스(lctreSeq) 들어있는 맵", dataTypeClass = Object.class)
	public ResponseEntity<?> selectExprn(@RequestBody Map<String, Object> paramMap) throws Exception {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				experienceService.selectExprn("Experience.selectExprn", paramMap));
	}

	@PostMapping(value = "/selectExprnOperateList.api")
	@ApiOperation(value = "모든 체험예약 리스트 출력", notes = "현재 DB에 저장된 모든 체험예약 리스트를 출력합니다 .")
	public ResponseEntity<?> selectExprnOperateList(@RequestBody Map<String, Object> paramMap) throws Exception {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectPaging("Experience.selectExprnOperateListPaging", paramMap));
	}

	/**
	 * 체험예약 Detail
	 */
	@PostMapping(value = "/selectExperienceDetail.api")
	@ApiOperation(value = "Experience상세보기", notes = "선택한 Experience의 상세정보를 불러옵니다.")
	@ApiImplicitParam(name = "paramMap", value = "체험예약 시퀀스(exprnSeq) 들어있는 맵", dataTypeClass = Map.class)
	public ResponseEntity<?> selectExperienceDetail(@UserParam Map<String, Object> paramMap) {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				experienceService.selectExperienceDetail("Experience.selectExperienceDetail", paramMap));
	}

	/**
	 * 체험예약
	 *
	 */
	@PostMapping(value = "/selectExperienceOperate.api")
	@ApiOperation(value = "체험예약일정테이블, 체험예약테이블, 체험예약키워드테이블, 이용자테이블, 체험예약수강테이블, 체험예약출석테이블 출력", notes = "현재 DB에 저장된 체험예약내용을 출력합니다.")
	@ApiImplicitParam(name = "paramMap", value = "체험예약 시퀀스(exprnSeq), 체험예약 시퀀스(exprnSn) 들어있는 맵", dataTypeClass = Object.class)
	public ResponseEntity<?> selectExperienceFx(@RequestBody Map<String, Object> paramMap) throws Exception {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectMap("Experience.selectExperienceOperate", paramMap));
	}

	@PostMapping(value = "/deleteExprnOne.api")
	@ApiOperation(value = "체험예약 삭제", notes = "체험예약 게시물을 삭제합니다")
	@ApiImplicitParam(name = "paramMap", value = "체험예약 시퀀스(exprnSeq), 체험예약 시퀀스(exprnSn) 들어있는 맵", dataTypeClass = Object.class)
	public ResponseEntity<?> deleteExprnOne(@RequestBody Map<String, Object> paramMap) throws Exception {
		int result = experienceService.deleteExprnOne(paramMap);
		Map<String, Object> resultMap = new HashMap<>();
		resultMap.put("result", result);
		if (result == -1) {
			return CommonResponse.statusResponse(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		}
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, resultMap);
	}

	/**
	 * 체험예약 참여자 List
	 *
	 * @throws Exception
	 */
	@PostMapping(value = "/selectExperienceParticipantsList.api")
	@ApiOperation(value = "체험예약 참여자 목록", notes = "해당 체험예약의 참여자들을 조회합니다.")
	@ApiImplicitParam(name = "paramMap", value = "체험예약 시퀀스(exprnSeq), 체험예약 시퀀스(exprnSn) 들어있는 맵", dataTypeClass = Object.class)
	public ResponseEntity<?> selectExperienceFxParticipantsList(@RequestBody Map<String, Object> paramMap)
			throws Exception {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectList("Experience.selectExperienceParticipantsList", paramMap));
	}

	/**
	 * 체험 등록자 List
	 *
	 * @throws Exception
	 */
	@PostMapping(value = "/selectExperienceUserList.api")
	@ApiOperation(value = "체험 등록자 List", notes = "체험 등록자 List")

	@ApiImplicitParam(name = "paramMap", value = "체험예약 시퀀스(exprnSeq), 체험예약 시퀀스(exprnSn) 들어있는 맵", dataTypeClass = Object.class)
	public ResponseEntity<?> selectExperienceUserList(@RequestBody Map<String, Object> paramMap) throws Exception {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectList("Experience.selectExperienceUserList", paramMap));
	}

	@PostMapping(value = "/selectExperienceParticipantsInfo.api")
	@ApiOperation(value = "체험예약 참여자 목록", notes = "해당 체험예약의 참여자들을 조회합니다.")
	public ResponseEntity<?> selectExperienceParticipantsInfo(@UserParam Map<String, Object> paramMap)
			throws Exception {

		Map<String, Object> result = commonService.selectMap("Experience.selectExperienceListPaging", paramMap);
		List<Map<String, Object>> selectExperienceParticipantsList = commonService
				.selectList("Experience.selectExperienceParticipantsListPaging", paramMap);
		result.put("ExperienceUserList", selectExperienceParticipantsList);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, result);
	}

	@SuppressWarnings("unchecked")
	@PostMapping(value = "/getCurrentUserListExcel.api")
	@ApiOperation(value = "현재 체험예약신청자 다운로드", notes = "현재 체험예약신청자 성명 및 사용자번호 엑셀 다운로드")
	@ApiImplicitParam(name = "paramMap", value = "{'exprnUserArray': exprnUserArray}", dataTypeClass = String.class)
	public void getCurrentUserListExcel(@RequestBody Map<String, Object> paramMap, HttpServletResponse response)
			throws Exception {

		List<Map<String, Object>> datas = new ArrayList<>();

		Map<String, Object> userListMap = new CamelHashMap();
		userListMap.put("headers", new String[] { "순번", "이름"});

		ArrayList<String> exprnUserList = (ArrayList<String>) paramMap.get("exprnUserArray");

		List<Map<String, Object>> listMap = new ArrayList<>();
		exprnUserList.forEach((el) -> {
			int index = 1;
			String userSeq = el.substring(el.indexOf("(") + 1, el.indexOf(")"));
			String userName = el.substring(0, el.indexOf("("));
			Map<String, Object> exprnUserMap = new HashMap<>();
			exprnUserMap.put("이름", userSeq);
			//exprnUserMap.put("소속",userName );
			listMap.add(exprnUserMap);
		});
		userListMap.put("list", listMap);
		datas.add(userListMap);
		// excelService.exportDataToExcel("현재 체험예약신청자 현황", datas, true, response);
	}

	@PostMapping(value = "/getCurrentParticipantsListExcel.api")
	@ApiOperation(value = "현재 체험참여자 다운로드", notes = "현재 체험참여자 성명 및 사용자번호 엑셀 다운로드")
	@ApiImplicitParam(name = "paramMap", value = "{'exprnParticipantUserArray': exprnParticipantUserArray}", example = "{'exprnParticipantUserArray', {'김기열(000032)',''강한나(000033)' }}", required = true, dataTypeClass = String.class)
	public void getCurrentParticipantsListExcel(@RequestBody Map<String, Object> paramMap, HttpServletResponse response)
			throws Exception {
		List<Map<String, Object>> datas = new ArrayList<>();

		Map<String, Object> userListMap = new CamelHashMap();
		userListMap.put("headers", new String[] { "순번", "이름" });

		ArrayList<String> exprnParticipantUserList = (ArrayList<String>) paramMap.get("exprnParticipantUserArray");
		List<Map<String, Object>> listMap = new ArrayList<>();

		exprnParticipantUserList.forEach((el) -> {
			int index = 1;
			String userSeq = el.substring(el.indexOf("(") + 1, el.indexOf(")"));
			String userName = el.substring(0, el.indexOf("("));
			Map<String, Object> exprnUserMap = new HashMap<>();
			exprnUserMap.put("이름", userSeq);
			//exprnUserMap.put("소속", userName);
			listMap.add(exprnUserMap);
		});

		userListMap.put("list", listMap);
		datas.add(userListMap);
	//	excelService.exportDataToExcel("현재 체험참여자 현황", datas, true, response);
	}

	@PostMapping(value = "/updateExprn.api")
	@ApiOperation(value = "experience 공통 update", notes = "exprn(체험예약, 체험신청 공통사용하는 update) ")
	@ApiImplicitParam(name = "paramMap", value = "체험예약 시퀀스(exprnSeq) 들어있는 맵", dataTypeClass = Map.class)
	public ResponseEntity<?> updateExprn(@UserParam Map<String, Object> paramMap) {
		experienceService.updateExprn(paramMap);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
	}

	/**
	 * 체험 예약 취소
	 *
	 * @throws Exception
	 */
	@PostMapping(value = "/updateExprnAttender.api")
	@ApiOperation(value = "exprn_reqst 칼럼에서 exprnSttusSe 값 변경", notes = "exprnSttusSe R->A")
	public ResponseEntity<?> updateExprnAttender(@UserParam Map<String, Object> paramMap) throws Exception {
		experienceService.updateExprnAttender(paramMap);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK);

	}

}
