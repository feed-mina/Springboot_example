package kr.so.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import kr.so.service.CommonService;
import kr.so.service.DashboardService;
import kr.so.util.CommonResponse;
import kr.so.util.UserParam;

@Api(tags = " Dashboard - 대시보드")
@RestController
@RequestMapping("/main")
public class DashboardController {

	private Logger log = LoggerFactory.getLogger(this.getClass());

	@Autowired
	DashboardService dashboardService;

	@Autowired
	CommonService commonService;


	@RequestMapping("/")
	public String index(){
		return "Hello Word\n";
	}

	@GetMapping("/dashboard")
		public String goDashBoard(){
		return "...";	
		//return "redirect:/kr/so/dashboard/main.html";
		}

 
	
	@PostMapping(value = "/selectCountUserSignUpSomeday.api")
	@ApiOperation(value = "특정일자에 회원가입한 사용자 수 조회", notes = "특정일자에 회원가입한 사용자 수")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{\r\n" + //
			"\t\"dateStr\": \"조회날짜(%Y-%m-%d)\"\r\n" + //
			"}", example = "{\r\n" + //
					"\t\"dateStr\": \"2023-08-31\"\r\n" + //
					"}")
	public ResponseEntity<?> selectCountUserSignUpSomeday(@UserParam Map<String, Object> paramMap) throws Exception {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectMap("sysDashboard.selectCountUserSignUpSomeday", paramMap));
	}

	@PostMapping(value = "/selectUserAuthorRatioList.api")
	@ApiOperation(value = "권한별 가입자 비율 조회", notes = "권한별 가입자 비율 수 조회")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{}", example = "{}")
	public ResponseEntity<?> selectUserAuthorRatioList(@UserParam Map<String, Object> paramMap) throws Exception {
		List<Map<String, Object>> resultList = commonService.selectList("sysDashboard.selectUserAuthorRatioList",
				paramMap);
		String[] userAuthorArr = new String[resultList.size()];
		String[] authorCountArr = new String[resultList.size()];
		for (int i = 0; i < resultList.size(); i++) {
			userAuthorArr[i] = resultList.get(i).get("userAuthorNm").toString();
			authorCountArr[i] = resultList.get(i).get("authorCount").toString();
		}
		Map<String, Object> result = new HashMap<>();
		result.put("userAuthorArr", userAuthorArr);
		result.put("authorCountArr", authorCountArr);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, result);
	}

	/**
	 * 대시보드 - 접속자 수 통계
	 */
	@PostMapping(value = "/selectUserLoginCountList.api")
	@ApiOperation(value = "기간별 접속자 수 통계", notes = "기간별 접속자 수 통계를 조회합니다.")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{\r\n" + //
			"\t\"daily\": {\r\n" + //
			"\t\t\"resultType\": \"조회타입\",\r\n" + //
			"\t\t\"searchType\": \"조회날짜타입\",\r\n" + //
			"\t\t\"dateType\": \"표시할 날짜타입\"\r\n" + //
			"\t}\r\n" + //
			"}", example = "{\r\n" + //
					"\t\"daily\": {\r\n" + //
					"\t\t\"resultType\": \"daily\",\r\n" + //
					"\t\t\"searchType\": \"%Y-%m-%d\",\r\n" + //
					"\t\t\"dateType\": \"%m월 %d일\"\r\n" + //
					"\t\t},\r\n" + //
					"\t\"monthly\": {\r\n" + //
					"\t\t\"resultType\": \"monthly\",\r\n" + //
					"\t\t\"searchType\": \"%Y-%m-%d\",\r\n" + //
					"\t\t\"dateType\": \"%Y년 %m월\"\r\n" + //
					"\t\t},\r\n" + //
					"\t\"times\": {\r\n" + //
					"\t\t\"resultType\": \"times\",\r\n" + //
					"\t\t\"searchType\": \"%Y-%m-%d %H\",\r\n" + //
					"\t\t\"dateType\": \"%H시\"\r\n" + //
					"\t\t}\r\n" + //
					"}")
	public ResponseEntity<?> selectUserLoginCountList(@UserParam Map<String, Object> paramMap) throws Exception {
		Map<String, Object> result = dashboardService.selectUserLoginCountList(paramMap);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, result);
	}

	/**
	 * 대시보드 - 오늘의 강의
	 */
	@PostMapping(value = "/selectTodayLctre.api")
	@ApiOperation(value = "오늘의 강의 조회", notes = "오늘의 강의 목록을 조회합니다.")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{}", example = "{}")
	public ResponseEntity<?> selectTodayLctre(@UserParam Map<String, Object> paramMap) throws Exception {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectList("sysDashboard.selectTodayLctre", paramMap));
	}

	/**
	 * 대시보드 - 오늘의 세미나
	 */
	@PostMapping(value = "/selectTodaySemina.api")
	@ApiOperation(value = "오늘의 세미나 조회", notes = "오늘의 세미나 목록을 조회합니다.")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{}", example = "{}")
	public ResponseEntity<?> selectTodaySemina(@UserParam Map<String, Object> paramMap) throws Exception {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectList("sysDashboard.selectTodaySemina", paramMap));
	}

	/**
	 * 대시보드 - 오늘의 상담
	 */
	@PostMapping(value = "/selectTodayCnslt.api")
	@ApiOperation(value = "오늘의 상담 조회", notes = "오늘의 상담 목록을 조회합니다.")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{}", example = "{}")
	public ResponseEntity<?> selectTodayCnslt(@UserParam Map<String, Object> paramMap) throws Exception {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectList("sysDashboard.selectTodayCnslt", paramMap));
	}

	/**
	 * 대시보드 - 오늘의 체험
	 */
	@PostMapping(value = "/selectTodayExprn.api")
	@ApiOperation(value = "오늘의 체험 조회", notes = "오늘의 체험 목록을 조회합니다.")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{}", example = "{}")
	public ResponseEntity<?> selectTodayExprn(@UserParam Map<String, Object> paramMap) throws Exception {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectList("sysDashboard.selectTodayExprn", paramMap));
	}

	/**
	 * 대시보드 - 공지사항
	 */
	@PostMapping(value = "/selectMainNotice.api")
	@ApiOperation(value = "대시보드 공지사항 리스트", notes = "대시보드에 노출할 공지사항 목록을 조회합니다.")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{}", example = "{}")
	public ResponseEntity<?> selectMainNotice(@UserParam Map<String, Object> paramMap) throws Exception {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectList("sysDashboard.selectMainNotice", paramMap));
	}

	/**
	 * 대시보드 - QNA
	 */
	@PostMapping(value = "/selectMainQna.api")
	@ApiOperation(value = "대시보드 공지사항 리스트", notes = "대시보드에 노출할 공지사항 목록을 조회합니다.")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value = "{}", example = "{}")
	public ResponseEntity<?> selectMainQna(@UserParam Map<String, Object> paramMap) throws Exception {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectList("sysDashboard.selectMainQna", paramMap));
	}

}
