package kr.so.controller;

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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import kr.so.mvc.service.CommonService;
import kr.so.service.LctreService;
import kr.so.service.TranslateService;
import kr.so.service.UserManageService;
import kr.so.util.CommonResponse;
import kr.so.util.UserParam;

@Api(tags = "02 User", description = "유저 데이터")
@RestController
@RequestMapping("/user")
public class UserController {

	private Logger log = LoggerFactory.getLogger(this.getClass());

	// @Autowired
	// private JwtTokenProvider jwtTokenProvider;

	@Autowired
	UserManageService userManageService;

	@Autowired
	CommonService commonService;
	@Autowired
	LctreService lctreService;

	@Autowired
	TranslateService translateService;

	// @Autowired
	// LoginService loginService;

	@PostMapping(value = "/userInfo.api")
	@ApiOperation(value = "유저 기본데이터", notes = "유저 기본데이터")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class,
		value = "{}",
		example = "{}"
	)
	public ResponseEntity<?> userInfo(@UserParam Map<String, Object> paramMap) throws Exception {
		
		Map<String, Object> result = commonService.selectMap("user.selectUserInfo", paramMap);
		List<Map<String, Object>> selectUserStplatList = commonService.selectList("user.selectUserStplat", paramMap);
		result.put("stplatCode", selectUserStplatList);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, result);
	}


	/*########################### */
	/*########################### */
	/*########################### */

	/**
	 * 수강신청가능한 강의목록 List
	 */
	@PostMapping(value = "/selectLctreAtnlcPosblList.api")
	@ApiOperation(value = "수강신청가능한 강의목록", notes = "사용자의 수강신청 가능한 목록을 조회합니다 applied : Y, rcritType I진행중 P모집예정 C:모집마감 lctre_knd_code강의 카테고리(LCTRE_KND_CODE_2) ")
	public ResponseEntity<?> selectLctreAtnlcPosblList(@UserParam Map<String, Object> paramMap) throws Exception {
		List<Map<String, Object>> lctreList = commonService.selectList("user.selectLctreAtnlcPosblList", paramMap);
		Map<String, Object> paramMapWithLctreSeq = new HashMap<>();
		for(Map<String, Object> lctre : lctreList){
			String lctreSeq = (String) lctre.get("lctreSeq");
			paramMapWithLctreSeq.put("lctreSeq", lctreSeq);
			lctre.put("lctreFx", userManageService.selectLctreOneDetail(paramMapWithLctreSeq));
		} 
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, lctreList);
	}

	/**
	 * 강의 수강신청
	 * @Param paramMap : {"lctreSeq":"LCTRE_00000091"} require
	 */
	@PostMapping(value = "/insertLctreAtnlc.api")
	@ApiOperation(value = "강의를 수강신청합니다.", notes = "강의수강 테이블에 데이터를 입력합니다.")
	public ResponseEntity<?> insertLctreAtnlc(@UserParam Map<String, Object> paramMap, HttpServletRequest req) throws Exception {
		Map<String, Object> user = (Map<String, Object>) paramMap.get("user");

		Map<String, Object> lctre = lctreService.selectLctre("sysLctre.selectLctre", paramMap);
		String lctreNm = (String) lctre.get("lctreNm");

		//alarmService.insertLctreAtnlc(Arrays.asList("A", "P", "M"), Arrays.asList((String) user.get("userSeq")), lctreNm, "");
		commonService.insert("user.insertLctreAtnlc", paramMap);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
	}

	/**
	 * 강의 수강삭제
	 * @Param paramMap : {"lctreSeq":"LCTRE_00000091"} require
	 */
	@PostMapping(value = "/deletetLctreAtnlc.api")
	@ApiOperation(value = "강의신청목록에 본인삭제.", notes = "\uAC15\uC758\uC2E0\uCCAD\uBAA9\uB85D\uC5D0 \uBCF8\uC778\uC0AD\uC81C.")
	public ResponseEntity<?> deletetLctreAtnlc(@UserParam Map<String, Object> paramMap, HttpServletRequest req) throws Exception {
		commonService.delete("user.deletetLctreAtnlc", paramMap);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
	}

	/**
	 * 개별 강좌 출석체크
	 * @Param paramMap : {"lctreSeq":"LCTRE_00000091", "lctreSn": 1} require
	 */
	@PostMapping(value = "/insertLctreAtend.api")
	@ApiOperation(value = "개별강좌 출석체크.", notes = "개별강좌 출석체크 {\"lctreSeq\":\"LCTRE_00000091\", \"lctreSn\": 1}")
	public ResponseEntity<?> insertLctreAtend(@UserParam Map<String, Object> paramMap, HttpServletRequest req) throws Exception {
		commonService.delete("user.insertLctreAtend", paramMap);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
	}

	/*########################### */
	/*########################### */
	/*########################### */

	/**
     * 
     *selectLctreAtnlcPosblList.api
     * @param paramMap
     * @return
     * @throws Exception
     */
    @PostMapping(value = "/selectSeminaPosbleList.api")
    @ApiOperation(value = "세미나 수강가능한 리스트", notes = "세미나 수강가능한 리스트 {userSeq: 'USER_00001213'}")
    @ApiImplicitParam(name = "paramMap", value = "", required = true, dataTypeClass = String.class)
    public ResponseEntity<?> selectSeminaPosbleList(@UserParam Map<String, Object> paramMap) throws Exception {

        return CommonResponse.statusResponse(HttpServletResponse.SC_OK, commonService.selectList("user.selectSeminaPosbleList", paramMap));
    }

	/**
     * 
     *selectLctreAtnlcPosblList.api
     * @param paramMap
     * @return
     * @throws Exception
     */
    // @PostMapping(value = "/registSemina.api")
    // @ApiOperation(value = "세미나 수강신청하기", notes = "세미나 수강신청하기 {seminaSeq: 'SEMINA_0000123'}")
    // @ApiImplicitParam(name = "paramMap", value = "", required = true, dataTypeClass = String.class)
    // public ResponseEntity<?> registSemina(@UserParam Map<String, Object> paramMap) throws Exception {
    //     return CommonResponse.statusResponse(HttpServletResponse.SC_OK, commonService.selectMap("user.insertSeminaAtnlc", paramMap));
    // }

	/**
     * 
     *selectLctreAtnlcPosblList.api
     * @param paramMap
     * @return
     * @throws Exception
     */
    @PostMapping(value = "/insertSeminaAtnlc.api")
    @ApiOperation(value = "세미나 수강신청하기", notes = "세미나 수강신청하기 {seminaSeq: 'SEMINA_0000123'}")
    @ApiImplicitParam(name = "paramMap", value = "", required = true, dataTypeClass = String.class)
    public ResponseEntity<?> insertSeminaAtnlc(@UserParam Map<String, Object> paramMap) throws Exception {
		Map<String, Object> user = (Map<String, Object>) paramMap.get("user");
		// 	Arrays.asList("A", "P", "M"), 
		// 	Arrays.asList((String) user.get("userSeq")),
		// 	"세미나 신청이 완료되었습니다", 
		// 	"세미나 신청이 완료되었습니다", 
		// 	"세미나 신청이 완료되었습니다",
		// 	"ALARM_CATEGORY_02",
		// 	"ALARM_TYPE_04" //신청완료
		// );

		Map<String, Object> semina = commonService.selectMap("sysSemina.selectSemina", paramMap);
		String seminaNm = (String) semina.get("seminaNm");

		//alarmService.insertSeminaAtnlc(Arrays.asList("A", "P", "M"), Arrays.asList((String) user.get("userSeq")), seminaNm, "");

		commonService.insert("user.insertSeminaAtnlc", paramMap);
        return CommonResponse.statusResponse(HttpServletResponse.SC_OK );
    }

	// 세미나상담 - 등록된 자기 세미나상담목록 수정하기 - 결석 출석 등
	@PostMapping(value = "/updateSeminaAtnlc.api")
    @ApiOperation(value = "각 세미나상담별 세미나상담목록에 자기 수정(결석 출석등)", notes = "각 세미나상담별 세미나상담목록 {exprnSeq: 'EXPRN_00000257', exprnSn: 1}")
    @ApiImplicitParam(name = "paramMap", value = "", required = true, dataTypeClass = String.class)
    public ResponseEntity<?> updateSeminaAtnlc(@UserParam Map<String, Object> paramMap) throws Exception {
        return CommonResponse.statusResponse(HttpServletResponse.SC_OK, commonService.selectList("user.updateSeminaAtnlc", paramMap));
    }

	// 세미나상담 - 등록된 자기 세미나상담목록 수정하기 - 결석 출석 등
	@PostMapping(value = "/deleteSeminaAtnlc.api")
    @ApiOperation(value = "세미나상담목록에서 본인삭제", notes = "세미나상담목록에서 본인삭제 {exprnSeq: 'EXPRN_00000257'}")
    @ApiImplicitParam(name = "paramMap", value = "", required = true, dataTypeClass = String.class)
    public ResponseEntity<?> deleteSeminaAtnlc(@UserParam Map<String, Object> paramMap) throws Exception {
        return CommonResponse.statusResponse(HttpServletResponse.SC_OK, commonService.selectList("user.deleteSeminaAtnlc", paramMap));
    }

	


	// 교수상담 체험교수상담 체험
	// 교수상담 체험교수상담 체험
	// 교수상담 교수상담 체험

	// 교수상담 - 교수목록
    @PostMapping(value = "/selectPrfsorList.api")
    @ApiOperation(value = "상담 교수 목록", notes = "상담 교수 목록 {}")
    @ApiImplicitParam(name = "paramMap", value = "", required = true, dataTypeClass = String.class)
    public ResponseEntity<?> selectPrfsorList(@UserParam Map<String, Object> paramMap) throws Exception {
        return CommonResponse.statusResponse(HttpServletResponse.SC_OK, commonService.selectList("user.selectPrfsorList", paramMap));
    }

	// 교수상담 - 교수별 상담목록
    @PostMapping(value = "/selectPrfsorCnsltPosbleList.api")
    @ApiOperation(value = "교수별 상담가능목록", notes = "교수별 상담목록 {prfsorUserSeq: 'USER_00000017'}")
    @ApiImplicitParam(name = "paramMap", value = "", required = true, dataTypeClass = String.class)
    public ResponseEntity<?> selectPrfsorCnsltPosbleList(@UserParam Map<String, Object> paramMap) throws Exception {
		
        return CommonResponse.statusResponse(HttpServletResponse.SC_OK, commonService.selectList("user.selectPrfsorCnsltPosbleList", paramMap));
    }

	// 교수상담 - 교수별 상담 insert하기
    @PostMapping(value = "/insertCnsltReqst.api")
    @ApiOperation(value = "교수별상담 insert하기", notes = "교수별상담 insert하기 {cnsltSeq: 'CNSLT_00000257', cnsltSn: 1}")
    @ApiImplicitParam(name = "paramMap", value = "", required = true, dataTypeClass = String.class)
    public ResponseEntity<?> registCnslt(@UserParam Map<String, Object> paramMap) throws Exception {
		// 	Arrays.asList("A", "P", "M"), 
		// 	Arrays.asList((String) user.get("userSeq")), 
		// 	"상담신청이 완료되었습니다", 
		// 	"상담신청이 완료되었습니다", 
		// 	"상담신청이 완료되었습니다",
		// 	"ALARM_CATEGORY_03",
		// 	"ALARM_TYPE_04" //신청완료
		// );
		Map<String, Object> user = (Map<String, Object>) paramMap.get("user");
	
		Map<String, Object> cnslt = commonService.selectMap("Consult.selectConsultOperate", paramMap);
		String userNm = (String) cnslt.get("userNm");//교수명

		//alarmService.insertCnsltReqst(Arrays.asList("A", "P", "M"), Arrays.asList((String) user.get("userSeq")), userNm, "");
		commonService.insert("user.insertCnsltReqst", paramMap);

        return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
    }
	
	// 교수상담 - 등록된 자기 교수상담목록 수정하기 - 결석 출석 등
	@PostMapping(value = "/updateCnsltReqst.api")
    @ApiOperation(value = "각 교수상담별 교수상담목록에 자기 수정(결석 출석등)", notes = "각 교수상담별 교수상담목록 {exprnSeq: 'EXPRN_00000257', exprnSn: 1}")
    @ApiImplicitParam(name = "paramMap", value = "", required = true, dataTypeClass = String.class)
    public ResponseEntity<?> updateCnsltReqst(@UserParam Map<String, Object> paramMap) throws Exception {
        return CommonResponse.statusResponse(HttpServletResponse.SC_OK, commonService.selectList("user.updateCnsltReqst", paramMap));
    }

	// 교수상담 - 등록된 자기 교수상담목록 수정하기 - 결석 출석 등
	@PostMapping(value = "/deleteCnsltReqst.api")
    @ApiOperation(value = "교수상담목록에서 본인삭제", notes = "교수상담목록에서 본인삭제 {exprnSeq: 'EXPRN_00000257', exprnSn: 1}")
    @ApiImplicitParam(name = "paramMap", value = "", required = true, dataTypeClass = String.class)
    public ResponseEntity<?> deleteCnsltReqst(@UserParam Map<String, Object> paramMap) throws Exception {
        return CommonResponse.statusResponse(HttpServletResponse.SC_OK, commonService.selectList("user.deleteCnsltReqst", paramMap));
    }

	// 체험시작 체험체험시작 체험
	// 체험시작 체험체험시작 체험
	// 체험시작 체험체험시작 체험

	// 체험 - 체험종류별(차, 도자기 ...) 체험 목록 
	@PostMapping(value = "/selectExprnPosbleList.api")
    @ApiOperation(value = "각 체험별 체험목록", notes = "각 체험별 체험목록 {exprnKndCode: 'W:서예체험, T: 차체험, C:도장체험, S:향체험'}")
    @ApiImplicitParam(name = "paramMap", value = "", required = true, dataTypeClass = String.class)
    public ResponseEntity<?> selectExprnPosbleList(@UserParam Map<String, Object> paramMap) throws Exception {
        return CommonResponse.statusResponse(HttpServletResponse.SC_OK, commonService.selectList("user.selectExprnPosbleList", paramMap));
    }

	// 체험 - 체험종류별(차, 도자기 ...) 체험 목록에 자기 등록하기
	@PostMapping(value = "/insertExprnReqst.api")
    @ApiOperation(value = "각 체험별 체험목록에 자기 등록하기", notes = "각 체험별 체험목록 {exprnSeq: 'EXPRN_00000257', exprnSn: 1}")
    @ApiImplicitParam(name = "paramMap", value = "", required = true, dataTypeClass = String.class)
    public ResponseEntity<?> insertExprnReqst(@UserParam Map<String, Object> paramMap) throws Exception {
		// 	Arrays.asList("A", "P", "M"), 
		// 	Arrays.asList((String) user.get("userSeq")), 
		// 	"상담신청이 완료되었습니다", 
		// 	"상담신청이 완료되었습니다", 
		// 	"상담신청이 완료되었습니다",
		// 	"ALARM_CATEGORY_03",
		// 	"ALARM_TYPE_04" //신청완료
		// );
		Map<String, Object> user = (Map<String, Object>) paramMap.get("user");
	
		Map<String, Object> exprn = commonService.selectMap("Experience.selectExperienceOperate", paramMap);
		String exprnKndCodeStr = (String) exprn.get("exprnKndCodeStr");//체험명
		
		//alarmService.insertExprnReqst(Arrays.asList("A", "P", "M"), Arrays.asList((String) user.get("userSeq")), exprnKndCodeStr, "");

		commonService.insert("user.insertExprnReqst", paramMap);

        return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
    }

	// 체험 - 등록된 자기 체험목록 수정하기 - 결석 출석 등
	@PostMapping(value = "/updateExprnReqst.api")
    @ApiOperation(value = "각 체험별 체험목록에 자기 수정(결석 출석등)", notes = "각 체험별 체험목록 {exprnSeq: 'EXPRN_00000257', exprnSn: 1}")
    @ApiImplicitParam(name = "paramMap", value = "", required = true, dataTypeClass = String.class)
    public ResponseEntity<?> updateExprnReqst(@UserParam Map<String, Object> paramMap) throws Exception {
        return CommonResponse.statusResponse(HttpServletResponse.SC_OK, commonService.selectList("user.updateExprnReqst", paramMap));
    }

	// 체험 - 등록된 자기 체험목록 수정하기 - 결석 출석 등
	@PostMapping(value = "/deleteExprnReqst.api")
    @ApiOperation(value = "체험목록에서 본인삭제", notes = "체험목록에서 본인삭제 {exprnSeq: 'EXPRN_00000257', exprnSn: 1}")
    @ApiImplicitParam(name = "paramMap", value = "", required = true, dataTypeClass = String.class)
    public ResponseEntity<?> deleteExprnReqst(@UserParam Map<String, Object> paramMap) throws Exception {
        return CommonResponse.statusResponse(HttpServletResponse.SC_OK, commonService.selectList("user.deleteExprnReqst", paramMap));
    }


	/*#############유저목록 끝 ############## */
	/*########################### */
	/*########################### */

    /**
     * 회원 useAt 업데이트
     *
     * @param paramMap
     * @return
     * @throws Exception
     */
    @PostMapping(value = "/updateMberUseAt.api")
    @ApiOperation(value = "회원 탈퇴처리", notes = "회원 useAt 업데이트(탈퇴) - S:휴직, D:탈퇴  {userSeq:USER_000123, useAt:D}")
    @ApiImplicitParam(name = "paramMap", value = "", required = true, dataTypeClass = String.class)
    public ResponseEntity<?> updateMberUseAt(@UserParam Map<String, Object> paramMap) throws Exception {
        return CommonResponse.statusResponse(HttpServletResponse.SC_OK, commonService.selectMap("user.updateMberUseAt", paramMap));
    }

	@PostMapping(value = "/userInfoWithAuthor.api")
	@ApiOperation(value = "권한에 따른 유저 기본데이터", notes = "권한별 유저 기본데이터")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class,
			value = "{}",
			example = "{}"
	)
	public ResponseEntity<?> userInfoWithAuthor(@UserParam Map<String, Object> paramMap) throws Exception {
		String[] userAuthorArr = paramMap.get("userAuthor").toString().split(",");
		for (int i=0; i<userAuthorArr.length; i++) {
			paramMap.put("userAuthor" + String.valueOf(i), userAuthorArr[i]);
		}

		List<Map<String, Object>> resultList = commonService.selectList("user.selectUserInfoWithAuthor", paramMap);
		Map<String, Object> resultMap = new HashMap<>();
		resultMap.put("list", resultList);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, resultMap);
	}

	@PostMapping(value = "/userInfoList.api")
	@ApiOperation(value = "유저 기본데이터 리스트", notes = "유저 기본데이터 리스트")
	@ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class,
			value = "{}",
			example = "{}"
	)
	public ResponseEntity<?> userInfoList(@UserParam Map<String, Object> paramMap) throws Exception {
		List<Map<String, Object>> resultList = commonService.selectList("user.selectUserList", paramMap);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, resultList);
	}
}
