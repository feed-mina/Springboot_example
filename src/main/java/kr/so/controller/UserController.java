package kr.so.controller;

import java.util.HashMap;
import java.util.List;
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
import kr.so.service.CommonService;
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
