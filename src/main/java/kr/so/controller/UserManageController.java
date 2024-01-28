package kr.so.controller;

import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import kr.so.mvc.service.CommonService;
import kr.so.service.UserManageService;
import kr.so.util.CommonResponse;
import kr.so.util.UserParam;

@Api(tags = "03 UserManage", description = "수강생 관리")
@RestController
@RequestMapping("/userManage")
public class UserManageController {
	private Logger log = LoggerFactory.getLogger(this.getClass());

	@Autowired
	CommonService commonService;

	@Autowired
	UserManageService userManageService;
	/**
	 * 수강생 List
	 */
	@PostMapping(value = "/selectUserList.api")
	@ApiOperation(value = "수강생 목록 조회", notes = "수강생 목록을 불러옵니다.")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{\r\n" + //
			"\t\"useAt\": \"회원상태(기본 - false, 탈퇴자 포함 시 true)\",\r\n" + //
			"\t\"authorOne\": \"특정회원종류\",\r\n" + //
			"\t\"searchText\": \"검색어\",\r\n" + //
			"\t\"guestAuthor\": \"게스트포함 유무(기본-false)\"\r\n" + //
			"}", example = "{\r\n" + //
					"\t\"useAt\": \"false\",\r\n" + //
					"\t\"authorOne\": \"\",\r\n" + //
					"\t\"searchText\": \"\",\r\n" + //
					"\t\"guestAuthor\": \"false\"\r\n" + //
					"}")
	public ResponseEntity<?> selectUserList(@UserParam Map<String, Object> paramMap) {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectPaging("userManage.selectUserListPaging", paramMap));
	}

	/**
	 * 수강생 상세보기
	 */
	@PostMapping(value = "/selectUserOneDetail.api")
	@ApiOperation(value = "수강생 상세보기", notes = "선택한 수강생 상세 정보를 불러옵니다.")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{\r\n" + //
			"\t\"userSeq\": \"userSeq\"\r\n" + //
			"}", example = "{\r\n" + //
					"\t\"userSeq\": \"USER_00000063\"\r\n" + //
					"}")
	public ResponseEntity<?> selectUserOneDetail(@UserParam Map<String, Object> paramMap) {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectMap("userManage.selectUserOneDetail", paramMap));
	}

	/**
	 * 수강생 신청중인 강의 List
	 *
	 * @throws Exception
	 */
	@PostMapping(value = "/selectUserOneLctreList.api")
	@ApiOperation(value = "수강생 신청중인 강의목록", notes = "선택한 수강생의 신청중인 강의목록을 불러옵니다.")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{\r\n" + //
			"\t\"userSeq\": \"userSeq\"\r\n" + //
			"}", example = "{\r\n" + //
					"\t\"userSeq\": \"USER_00000063\"\r\n" + //
					"}")
	public ResponseEntity<?> selectUserOneLctreList(@UserParam Map<String, Object> paramMap) throws Exception {

		Map<String, Object> resultMap = userManageService.selectUserOneLctreList(paramMap);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, resultMap);
	}

	/**
	 * 수강생 신청 강의 취소
	 *
	 * @throws Exception
	 */
	@PostMapping(value = "/updateLctreCancl.api")
	@ApiOperation(value = "수강생 신청중인 강의 취소", notes = "수강생의 신청중인 강의를 취소합니다.")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{\r\n" + //
			"\t\"userSeq\": \"userSeq\",\r\n" + //
			"\t\"lctreCnclList\": \"[취소할 강의 SEQ 리스트]\"\r\n" + //
			"}", example = "{\r\n" + //
					"\t\"userSeq\": \"USER_00000063\",\r\n" + //
					"\t\"lctreCnclList\": \"[]\"\r\n" + //
					"}")
	public ResponseEntity<?> updateLctreCancl(@UserParam Map<String, Object> paramMap) throws Exception {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectMap("userManage.updateLctreCancl", paramMap));
	}

	/**
	 * 수강생 신청 세미나 List
	 *
	 * @throws Exception
	 */
	@PostMapping(value = "/selectUserOneSeminaList.api")
	@ApiOperation(value = "수강생 신청중인 세미나목록", notes = "선택한 수강생의 신청중인 세미나목록을 불러옵니다.")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{\r\n" + //
			"\t\"userSeq\": \"userSeq\"\r\n" + //
			"}", example = "{\r\n" + //
					"\t\"userSeq\": \"USER_00000063\"\r\n" + //
					"}")
	public ResponseEntity<?> selectUserOneSeminaList(@UserParam Map<String, Object> paramMap) throws Exception {

		Map<String, Object> resultMap = userManageService.selectUserOneSeminaList(paramMap);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, resultMap);
	}

	/**
	 * 수강생 신청 세미나 취소
	 *
	 * @throws Exception
	 */
	@PostMapping(value = "/updateSeminaCancl.api")
	@ApiOperation(value = "수강생 신청중인 세미나 취소", notes = "수강생의 신청중인 세미나를 취소합니다.")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{\r\n" + //
			"\t\"userSeq\": \"userSeq\",\r\n" + //
			"\t\"seminaCnclList\": \"[취소할 세미나 SEQ 리스트]\"\r\n" + //
			"}", example = "{\r\n" + //
					"\t\"userSeq\": \"USER_00000063\",\r\n" + //
					"\t\"lctreCnclList\": \"[]\"\r\n" + //
					"}")
	public ResponseEntity<?> updateSeminaCancl(@UserParam Map<String, Object> paramMap) throws Exception {

		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectMap("userManage.updateSeminaCancl", paramMap));
	}

	/**
	 * 수강생 강의 수강중, 수강완료 List
	 *
	 * @throws Exception
	 */
	@PostMapping(value = "/selectUserOneAnFLctreList.api")
	@ApiOperation(value = "수강중 및 수강완료된 강의 목록 조회", notes = "수강생의 수강중 및 수강완료된 강의 목록을 조회합니다.")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{\r\n" + //
			"\t\"userSeq\": \"userSeq\"\r\n" + //
			"}", example = "{\r\n" + //
					"\t\"userSeq\": \"USER_00000063\"\r\n" + //
					"}")
	public ResponseEntity<?> selectUserOneAnFLctreList(@UserParam Map<String, Object> paramMap) throws Exception {

		Map<String, Object> resultMap = userManageService.selectUserOneAnFLctreList(paramMap);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, resultMap);
	}

	/**
	 * 수강생 세미나 참여중, 참여완료 List
	 *
	 * @throws Exception
	 */
	@PostMapping(value = "/selectUserOneAnFSeminaList.api")
	@ApiOperation(value = "세미나 참여 중 및 참여완료 목록 조회", notes = "수강생의 세미나 참여 중 및 참여완료된 목록을 조회합니다.")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{\r\n" + //
			"\t\"userSeq\": \"userSeq\"\r\n" + //
			"}", example = "{\r\n" + //
					"\t\"userSeq\": \"USER_00000063\"\r\n" + //
					"}")
	public ResponseEntity<?> selectUserOneAnFSeminaList(@UserParam Map<String, Object> paramMap) throws Exception {

		Map<String, Object> resultMap = userManageService.selectUserOneAnFSeminaList(paramMap);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, resultMap);
	}

	/**
	 * 강의 상세정보 및 강의목록 List
	 *
	 * @throws Exception
	 */
	@PostMapping(value = "/selectLctreOneDetail.api")
	@ApiOperation(value = "강의 상세정보", notes = "선택한 강의 상세정보 및 강의목록 조회합니다.")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{\r\n" + //
			"\t\"lctreSeq\": \"lctreSeq\"\r\n" + //
			"}", example = "{\r\n" + //
					"\t\"lctreSeq\": \"LCTRE_00000091\"\r\n" + //
					"}")
	public ResponseEntity<?> selectLctreOneDetail(@UserParam Map<String, Object> paramMap) throws Exception {

		Map<String, Object> resultMap = userManageService.selectLctreOneDetail(paramMap);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, resultMap);
	}

	/**
	 * 세미나 상세정보
	 */
	@PostMapping(value = "/selectSeminaOneDetail.api")
	@ApiOperation(value = "세미나 상세정보", notes = "선택한 세미나의 상세정보를 조회합니다.")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{\r\n" + //
			"\t\"seminaSeq\": \"seminaSeq\"\r\n" + //
			"}", example = "{\r\n" + //
					"\t\"seminaSeq\": \"1\"\r\n" + //
					"}")
	public ResponseEntity<?> selectSeminaOneDetail(@UserParam Map<String, Object> paramMap) {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectMap("userManage.selectSeminaOneDetail", paramMap));
	}

	/**
	 * 등급 List
	 */
	@PostMapping(value = "/selectUserGradeList.api")
	@ApiOperation(value = "회원 등급 목록", notes = "회원 등급 목록을 조회합니다.")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{\r\n" + //
			"\t\"sDate\": \"검색지정 달(기본 - 전월)\",\r\n" + //
			"\t\"userSeq\": \"(유저용)유저고유번호\",\r\n" + //
			"\t\"authorOne\": \"특정회원종류\",\r\n" + //
			"\t\"searchText\": \"검색어\"\r\n" + //
			"}", example = "{\r\n" + //
					"\t\"sDate\": \"2023-06-01\",\r\n" + //
					"\t\"userSeq\": \"\",\r\n" + //
					"\t\"authorOne\": \"\",\r\n" + //
					"\t\"searchText\": \"\"\r\n" + //
					"}")
	public ResponseEntity<?> selectUserGradeList(@UserParam Map<String, Object> paramMap) {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectList("userManage.selectUserGradeList", paramMap));
	}

	/**
	 * 등급 등록 및 변경 List 저장
	 */
	@PostMapping(value = "/upsertUserGrade.api")
	@ApiOperation(value = "회원 등급 등록 및 변경", notes = "회원 등급 등록 및 변경합니다.")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{\r\n" + //
			"\t\"gradeList\": \"gradeList\"\r\n" + //
			"}", example = "{\r\n" + //
					"\t\"gradeList\": \"[]\"\r\n" + //
					"}")
	public ResponseEntity<?> upsertUserGrade(@UserParam Map<String, Object> paramMap) throws Exception {
		userManageService.upsertUserGrade(paramMap);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
	}

	/**
	 * 유저 등급 List 엑셀파일
	 */
	@PostMapping(value = "/exportExcelUserGradeList.api")
	@ApiOperation(value = "유저 등급 리스트 다운로드", notes = "현재 유저정보 및 등급정보 리스트 엑셀 다운로드")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{\r\n" + //
			"\t\"listDate\": \"검색지정 달(기본 - 전월)\",\r\n" + //
			"\t\"months\": \"[검색 month 리스트]\",\r\n" + //
			"\t\"userList\": \"[회원정보목록]\"\r\n" + //
			"}", example = "{\r\n" + //
					"\t\"listDate\": \"2023년6월\",\r\n" + //
					"\t\"months\": [\"12월\",\"23.01월\",\"2월\",\"3월\",\"4월\",\"5월\",\"6월\"],\r\n" + //
					"\t\"userList\": [{\"userSeq\":\"USER_00000132\",\"userAuthorNm\":\"순천향대학생\","
					+ "\"userNm\":\"이름11\",\"userNcnm\":\"닉1\",\"userEmail\":\"sjh@musicen.com\",\"logCnt\":0,\"timeDiff\":\"-\","
					+ "\"gradeHx\":\"-\",\"gradePt\":\"다이아몬드\",\"gradeQd\":\"골드\",\"gradeTp\":\"브론즈\","
					+ "\"gradeDl\":\"실버\",\"gradeSg\":\"플래티넘\",\"gradeZr\":\"다이아몬드\"}]\r\n" + //
					"}")
	public void exportExcelUserGradeList(@UserParam Map<String, Object> paramMap, HttpServletResponse response)
			throws Exception {
		userManageService.exportExcelUserGradeList(paramMap, response);
	}

	/**
	 * 마이룸 > 등급 조회
	 */
	@PostMapping(value = "/selectUserOneGrade.api")
	@ApiOperation(value = "마이룸 나의 등급 조회 (유저용)", notes = "나의 회원 등급을 조회합니다.")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{}", example = "{}")
	public ResponseEntity<?> selectUserOneGrade(@UserParam Map<String, Object> paramMap) {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectList("userManage.selectUserOneGrade", paramMap));
	}

}
