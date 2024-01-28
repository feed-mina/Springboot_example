package kr.so.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
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
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import kr.so.configuration.security.JwtTokenProvider;
import kr.so.mvc.service.CommonService;
import kr.so.service.ConsultService;
import kr.so.util.CamelHashMap;
import kr.so.util.CommonResponse;
import kr.so.util.CommonUtil;
import kr.so.util.UserParam;

@Api(tags = "05 consult - 교수 상담  ")
@RestController
@RequestMapping("/consult")
public class ConsultController {

	private Logger log = LoggerFactory.getLogger(this.getClass());
	@Autowired
	CommonService commonService;

	@Autowired
	ConsultService consultService;

	@Autowired
	JwtTokenProvider jwtTokenProvider;

	@PostMapping(value = "/selectConsultRegistranter.api")
	@ApiOperation(value = "상담일정테이블, 상담테이블, 상담키워드테이블, 이용자테이블, 상담수강테이블, 상담출석테이블 출력", notes = "현재 DB에 저장된 상담내용을 출력합니다.")
	public ResponseEntity<?> selectConsultRegistranter(@RequestBody Map<String, Object> paramMap) throws Exception {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectMap("Consult.selectConsultRegistranter", paramMap));
	}

	@PostMapping(value = "/updateCnsltOnAirAt.api")
	@ApiOperation(value = "onAirAt 지시밋 update", notes = "on_air_at 값 변경")
	@ApiImplicitParam(name = "paramMap", value = "onAirAt 값을 변경하는 Map", dataTypeClass = Map.class)
	public ResponseEntity<?> updateCnsltOnAirAt(@UserParam Map<String, Object> paramMap) {
		consultService.updateCnsltOnAirAt(paramMap);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
	}

	/**
	 * 수강생 신청 상담 취소
	 *
	 * @throws Exception
	 */
	@PostMapping(value = "/updateConsultCancl.api")
	@ApiOperation(value = "수강생 신청중인 상담 취소", notes = "수강생의 신청중인 상담를 취소합니다.")
	public ResponseEntity<?> updateConsultCancl(@UserParam Map<String, Object> paramMap) throws Exception {
		if (CommonUtil.isNotEmpty(paramMap.get("canclNtcnArray"))) {
			String canclNtcnList = (String) paramMap.get("canclNtcnArray");
			List<Map<String, Object>> applyUserList = commonService
					.selectList("Consult.selectConsultRegistranterListPaging", paramMap);

			// 교수상담 취소 알람 처리
			Map<String, Object> cnsltMap = commonService.selectMap("Consult.selectConsultOperate", paramMap);
			List<String> userSeqList = new ArrayList<>();
			for (Map<String, Object> applyUser : applyUserList) {
				if (applyUser.containsKey("cnsltUserSeq")) {
					userSeqList.add(applyUser.get("cnsltUserSeq").toString());
				}
			}
		/*
			alarmService.insertCnsltCancelAlarm(Arrays.asList(canclNtcnList.split(",")), userSeqList, // Arrays.asList("USER_00000132"),
					(String) cnsltMap.get("cnsltPlaceNm") + " " + (String) paramMap.get("cnsltSn") + "강", // cnslt_place_nm
					(String) paramMap.get("canclDc"));
		*/
		}

		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectMap("Consult.updateConsultCancl", paramMap));
	}

	/**
	 * 광고판 영상 및 이미지 Insert, Update
	 */
	@PostMapping(value = "/upsertBanner.api", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	@ApiOperation(value = "광고판 영상 및 이미지 저장", notes = "광고판용 영상 및 이미지 UPSERT")
	@ApiImplicitParams({
			@ApiImplicitParam(name = "cnsltFiles", required = false, paramType = "formData", value = "files", dataTypeClass = Object.class),
			@ApiImplicitParam(name = "paramMap", required = true, paramType = "formData", dataTypeClass = String.class, defaultValue = "{\r\n"
					+ //
					"\t\"bannerType\": \"VIDEO OR IMAGE\",\r\n" + //
					"\t\"bannerNm\": \"영상 및 이미지 고정 이름부여\"\r\n" + //
					"}", example = "{\r\n" + //
							"\t\"bannerNm\": \"VIDEO\",\r\n" + //
							"\t\"bannerNm\": \"adbanner.mp4\"\r\n" + //
							"}") })
	public ResponseEntity<?> upsertBanner(
			@RequestPart(value = "paramMap", required = true) Map<String, Object> paramMap,
			@RequestParam(value = "cnsltFiles", required = false) MultipartFile[] cnsltFiles) throws Exception {

		consultService.upsertBanner(paramMap, cnsltFiles);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
	}

	@PostMapping(value = "/insertCnslt.api")
	@ApiOperation(value = "consult 공통 insert", notes = "cnslt(교수상담, 체험신청 공통사용하는 insert) ")
	@ApiImplicitParam(name = "paramMap", value = "교수상담 시퀀스(cnsltSeq) 들어있는 맵", dataTypeClass = Map.class)
	public ResponseEntity<?> insertCcnslt(@UserParam Map<String, Object> paramMap) {
		consultService.insertCnslt(paramMap);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
	}

	@PostMapping(value = "/updateCnslt.api")
	@ApiOperation(value = "consult 공통 update", notes = "cnslt(교수상담, 체험신청 공통사용하는 update) ")
	@ApiImplicitParam(name = "paramMap", value = "교수상담 시퀀스(cnsltSeq) 들어있는 맵", dataTypeClass = Map.class)
	public ResponseEntity<?> updateCnslt(@UserParam Map<String, Object> paramMap) {
		consultService.updateCnslt(paramMap);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
	}

	@PostMapping(value = "/selectConsultList.api")
	@ApiOperation(value = "교수상담 개설 리스트 조회(페이징)", notes = "교수상당 목록을 불러옵니다.")
	@ApiImplicitParam(name = "paramMap", value = "교수상담 시퀀스(cnsltSeq) 들어있는 맵", dataTypeClass = String.class)
	public ResponseEntity<?> SelectCnslt(@RequestBody Map<String, Object> paramMap) throws Exception {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectPaging("Consult.selectConsultListPaging", paramMap));
	}

	@PostMapping(value = "/selectConsultTimeList.api")
	@ApiOperation(value = "교수상담 개설 리스트 조회", notes = "cnslt_fx 기준으로 list 조회를 합니다.")
	@ApiImplicitParam(name = "paramMap", value = "교수상담 시퀀스(cnsltSeq)과 순번(cnsltSn)을 조회", dataTypeClass = String.class)
	public ResponseEntity<?> selectConsultTimeList(@RequestBody Map<String, Object> paramMap) throws Exception {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectList("Consult.selectConsultListPaging", paramMap));
	}

	/**
	 * 상담
	 *
	 * @param paramMap 상담 시퀀스(cnsltSeq), 상담번호(cnsltSn) 들어있는 맵
	 * @return Map<String, Object> resultMap 상담일정테이블, 상담테이블, 상담키워드테이블, 이용자테이블,
	 *         상담수강테이블, 상담출석테이블
	 * @throws Exception
	 */
	@PostMapping(value = "/selectConsultOperate.api")
	@ApiOperation(value = "상담일정테이블, 상담테이블, 상담키워드테이블, 이용자테이블, 상담수강테이블, 상담출석테이블 출력", notes = "현재 DB에 저장된 상담내용을 출력합니다.")
	public ResponseEntity<?> selectConsultFx(@RequestBody Map<String, Object> paramMap) throws Exception {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectMap("Consult.selectConsultOperate", paramMap));
	}

	/**
	 * 상담 수강생 List
	 *
	 * @throws Exception
	 */
	@PostMapping(value = "/selectConsultUserList.api")
	@ApiOperation(value = "상담 수강생 목록", notes = "해당 상담의 수강생들을 조회합니다.")
	@ApiImplicitParam(name = "paramMap", value = "상담 시퀀스(cnsltSeq) 들어있는 맵", dataTypeClass = Object.class)
	public ResponseEntity<?> selectConsultUserList(@RequestBody Map<String, Object> paramMap) throws Exception {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectList("Consult.selectConsultUserList", paramMap));
	}

	/**
	 * 상담 참여자 List
	 *
	 * @throws Exception
	 */
	@PostMapping(value = "/selectConsultParticipantsList.api")
	@ApiOperation(value = "상담 참여자 목록", notes = "해당 상담의 참여자들을 조회합니다.")
	@ApiImplicitParam(name = "paramMap", value = "상담 시퀀스(cnsltSeq), 상담 시퀀스(cnsltSn) 들어있는 맵", dataTypeClass = Object.class)
	public ResponseEntity<?> selectConsultFxParticipantsList(@RequestBody Map<String, Object> paramMap)
			throws Exception {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectList("Consult.selectConsultParticipantsList", paramMap));
	}

	/**
	 * 상담 교수님 순번, 성함 
	@PostMapping(value = "/selectProfsrUserSeq.api")
	@ApiOperation(value = "교수님 순번 목록", notes = "해당 교수님 순번,이메일, 성함을 조회합니다.")
	@ApiImplicitParam(name = "paramMap", value = "교수상담 시퀀스(cnsltSeq) 들어있는 맵", dataTypeClass = Object.class)
	public ResponseEntity<?> selectUserGradeList(@UserParam Map<String, Object> paramMap) throws Exception {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectList("Consult.selectConsultInProfsrListPaging", paramMap));
	}
 */

 @PostMapping(value = "/selectProfsrUserSeq.api")
 @ApiOperation(value = "교수님 순번 목록", notes = "해당 교수님 순번,이메일, 성함을 조회합니다.")
 @ApiImplicitParam(name = "paramMap", value = "교수상담 시퀀스(cnsltSeq) 들어있는 맵", dataTypeClass = String.class)
 public ResponseEntity<?> selectUserGradeList(@UserParam Map<String, Object> paramMap) throws Exception {
	 return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
			 commonService.selectPaging("Consult.selectConsultInProfsrListPaging", paramMap));
 }
	@PostMapping(value = "/selectCnslt.api")
	@ApiOperation(value = "교수상담테이블, 교수상담일정테이블, 교수상담키워드 테이블 출력", notes = "현재 DB에 저장된 교수상담내용을 출력합니다.")
	public ResponseEntity<?> selectCnslt(@RequestBody Map<String, Object> paramMap) throws Exception {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				consultService.selectCnslt("Consult.selectCnslt", paramMap));
	}

	@PostMapping(value = "/selectCnsltOperateList.api")
	@ApiOperation(value = "모든 상담운영 리스트 출력", notes = "현재 DB에 저장된 모든 상담운영 리스트를 출력합니다 .")
	public ResponseEntity<?> selectCnsltOperateList(@RequestBody Map<String, Object> paramMap) throws Exception {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectPaging("Consult.selectCnsltOperateListPaging", paramMap));
	}

	/**
	 * 교수상담 tb_cnslt_fx 테이블 삭제
	 */
	@PostMapping(value = "/deleteCnsltOne.api")
	@ApiOperation(value = "교수상담 삭제", notes = "교수상담 게시물을 삭제합니다")
	public ResponseEntity<?> deletecnsltOne(@RequestBody Map<String, Object> paramMap) throws Exception {
		int result = consultService.deleteCnsltOne(paramMap);
		Map<String, Object> resultMap = new HashMap<>();
		resultMap.put("result", result);
		if (result == -1) {
			return CommonResponse.statusResponse(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
		}
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, resultMap);
	}

	/**
	 * 교수상담 Detail
	 */
	@PostMapping(value = "/selectConsultDetail.api")
	@ApiOperation(value = "교수상담 Detail", notes = "frontend와 연결")
	@ApiImplicitParam(name = "paramMap", value = "교수상담 시퀀스(cnsltSeq) 들어있는 맵", dataTypeClass = String.class)
	public ResponseEntity<?> selectConsultDetail(@UserParam Map<String, Object> paramMap) {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				consultService.selectConsultDetail("Consult.selectConsultDetail", paramMap));
	}

	@SuppressWarnings("unchecked")
	@PostMapping(value = "/getCurrentUserListExcel.api")
	@ApiOperation(value = "현재 상담신청자 다운로드", notes = "현재 상담신청자 성명 및 사용자번호 엑셀 다운로드")
	@ApiImplicitParam(name = "paramMap", value = "{'cnsltUserArray': cnsltUserArray}", dataTypeClass = String.class)
	public void getCurrentUserListExcel(@RequestBody Map<String, Object> paramMap, HttpServletResponse response)
			throws Exception {

		List<Map<String, Object>> datas = new ArrayList<>();

		Map<String, Object> userListMap = new CamelHashMap();
		userListMap.put("headers", new String[] { "순번", "이름", "소속" });

		ArrayList<String> cnsltUserList = (ArrayList<String>) paramMap.get("cnsltUserArray");

		List<Map<String, Object>> listMap = new ArrayList<>();
		cnsltUserList.forEach((el) -> {
			int index = 1;
			String userSeq = el.substring(el.indexOf("(") + 1, el.indexOf(")"));
			String userName = el.substring(0, el.indexOf("("));
			Map<String, Object> cnsltUserMap = new HashMap<>();
			cnsltUserMap.put("이름", userName);
			cnsltUserMap.put("소속", userSeq);
			listMap.add(cnsltUserMap);
		});
		userListMap.put("list", listMap);
		datas.add(userListMap);
//		excelService.exportDataToExcel("현재 상담신청자 현황", datas, true, response);
	}

	@PostMapping(value = "/getCurrentParticipantsListExcel.api")
	@ApiOperation(value = "현재 상담참여자 다운로드", notes = "현재 상담참여자 성명 및 사용자번호 엑셀 다운로드")
	@ApiImplicitParam(name = "paramMap", value = "{'cnsltParticipantUserArray': cnsltParticipantUserArray}", example = "{'cnsltParticipantUserArray', {'김기열(000032)',''강한나(000033)' }}", required = true, dataTypeClass = String.class)
	public void getCurrentParticipantsListExcel(@RequestBody Map<String, Object> paramMap, HttpServletResponse response)
			throws Exception {
		List<Map<String, Object>> datas = new ArrayList<>();

		Map<String, Object> userListMap = new CamelHashMap();
		userListMap.put("headers", new String[] { "순번", "이름", "소속" });

		ArrayList<String> cnsltParticipantUserList = (ArrayList<String>) paramMap.get("cnsltParticipantUserArray");
		List<Map<String, Object>> listMap = new ArrayList<>();

		cnsltParticipantUserList.forEach((el) -> {
			int index = 1;
			String userSeq = el.substring(el.indexOf("(") + 1, el.indexOf(")"));
			String userName = el.substring(0, el.indexOf("("));
			Map<String, Object> cnsltUserMap = new HashMap<>();
			cnsltUserMap.put("이름", userName);
			cnsltUserMap.put("소속", userSeq);
			listMap.add(cnsltUserMap);
		});

		userListMap.put("list", listMap);
		datas.add(userListMap);
		// excelService.exportDataToExcel("현재 상담참여자 현황", datas, true, response);
	}
}
