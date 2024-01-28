package kr.so.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import kr.so.configuration.security.JwtTokenProvider;
import kr.so.service.CommonService;
import kr.so.service.FileService;
import kr.so.service.SysManageService;
import kr.so.util.CommonResponse;
import kr.so.util.CommonUtil;
import kr.so.util.UserParam;

@Api(tags = " SysManage - 시스템 관리", description = "시스템 관리")
@RestController
@RequestMapping("/sysManage")
public class SysManageController {
    private Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    CommonService commonService;

    @Autowired
    JwtTokenProvider jwtTokenProvider;
	
    @Autowired
    SysManageService sysManageService;

	@Autowired
    FileService fileService;

	/* 블랙리스트 */
	/* 블랙리스트 */
	/* 블랙리스트 */
    /**
     * 신고하기(유니티)
     *
     * @param paramMap
     * @return
     * @throws Exception
     */
	@PostMapping(value = "/sttemntBlclst.api", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "블랙리스트 신고하기", notes = "유니티에서 만난 사람을 신고한다\r\n" + //
				"\t{\r\n" + //
				"\t\t\"userSeq\": \"신고자 시퀸스 USER_00000148\",\r\n" + //
				"\t\t\"trgetUserSeq\": \"USER_00000148\",\r\n" + //
				"\t\t\"blclstPrvonshCode\": \"BLCLST_01\",\r\n" + //
				"\t\t\"blclstPrvonshDtls\": \"기타카테고리일때만\",\r\n" + //
				"\t\t\"blclstDetailDtls\": \"상세내용입니다\"\r\n" + //
				"\t}\r\n" + //
				"\t")
    public ResponseEntity<?> sttemntBlclst(
		@RequestPart(value = "uploadFile", required = false) MultipartFile[] uploadFile,
		@RequestParam(value = "paramMap", required = true) Map<String, Object> paramMap, 
		HttpServletRequest req
	) throws Exception {
		/**
		 * 
		 * user_seq: user.userSeq
		 * regist_dt : now
		 * trget_user_seq : 대상 seq
		 * blclst_prvonsh_code : BLACK_01
		 * blclst_prvonsh_dtsl : 기타
		 * blclst_detail_dtsl - 상세
		 * lc_code - 안씀
		 * process_at S신고 W경고 P로그인금지 N조치중
		 * file_seq
		 */
		// 파일저장후 블랙리스트 insert

		List<String> requiredList = Arrays.asList("trgetUserSeq", "userSeq");
		if (!CommonUtil.validation(paramMap, requiredList)) {
			return null;
		}
		// Map<String, Object> sessionMap = CommonUtil.loginSession.get(jwtTokenProvider.getUserPk(jwtTokenProvider.resolveToken(req)));
		// paramMap.put("user", sessionMap);
		
		sysManageService.insertSttemntBlclst(uploadFile, paramMap);
        return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
    }
    
	/**
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	
    @PostMapping(value = "/selectMberBlclstPaging.api")
    @ApiOperation(value = "블랙리스트 신고 유저 목록 페이징", notes = "블랙리스트 신고 유저 목록 페이징 searchText:검색어, sttemntUser:신고자로필터링, trgetUser:피신고자필터링, ")
    @ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class
		,value = "{}" 
		,example = "{}" 
	)
    public ResponseEntity<?> selectMberBlclst(@UserParam Map<String, Object> paramMap) throws Exception {
        return CommonResponse.statusResponse(HttpServletResponse.SC_OK, sysManageService.selectMberBlclstPaging(paramMap) );

    }

    /**
     * @param paramMap
     * @return
     * @throws Exception
     */
    @PostMapping(value = "/selectMberBlclstDetail.api")
    @ApiOperation(value = "블랙리스트 디테일", notes = "블랙리스트 디테일 ")
    @ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class
		,value = "{}" 
		,example = "{}" 
	)
    public ResponseEntity<?> selectMberBlclstDetail(@UserParam Map<String, Object> paramMap) throws Exception {
		Map<String, Object> map = commonService.selectMap("sysManage.selectMberBlclstDetail", paramMap);
		map.put("fileSeq", map.get("fileSeq"));
		map.put("file", fileService.fileMap(map));
        return CommonResponse.statusResponse(HttpServletResponse.SC_OK, map);

    }

	/**
     * @param paramMap
     * @return
     * @throws Exception
     */
    @PostMapping(value = "/selectMyBlclst.api")
    @ApiOperation(value = "내가신고한 블랙리스트", notes = "내가신고한 블랙리스트")
    @ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class
		,value = "{}" 
		,example = "{}" 
	)
    public ResponseEntity<?> selectMyBlclst(@UserParam Map<String, Object> paramMap) throws Exception {
		Map<String, Object> user = (Map<String, Object>) paramMap.get("user");
		String sttemntSeq = (String) user.get("userSeq");
		paramMap.put("pageLength", 9999);
		paramMap.put("pageNo", 1);
		paramMap.put("sttemntUser", sttemntSeq);
        return CommonResponse.statusResponse(HttpServletResponse.SC_OK, sysManageService.selectMberBlclstPaging(paramMap) );

    }


	/**
     * 신고하기(유니티)
     *
     * @param paramMap
     * @return
     * @throws Exception
     */
    @PostMapping(value = "/updateSttemntBlclst.api")
    @ApiOperation(value = "관리자가 상태 신고상태 업데이트", notes = "관리자가 상태 신고상태 업데이트" )
    @ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class
		,value = "{userSeq: USER_00000148, processAt: 'N'}"
	)
    public ResponseEntity<?> selectMySttemnt(@UserParam Map<String, Object> paramMap) throws Exception {
		commonService.update("sysManage.updateSttemntBlclst", paramMap);
        return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
    }

    /**
     * 모든 회원 리스트
     *
     * @param paramMap
     * @return
     * @throws Exception
     */
    @PostMapping(value = "/selectSysUserList.api")
    @ApiOperation(value = "모든 회원 리스트 출력", notes = "현재 DB에 저장된 모든 회원 리스트를 출력합니다.")
    @ApiImplicitParam(name = "paramMap", value = "", required = true, dataTypeClass = String.class)
    public ResponseEntity<?> selectSysUserList(@UserParam Map<String, Object> paramMap) throws Exception {
        return CommonResponse.statusResponse(HttpServletResponse.SC_OK, commonService.selectPaging("sysManage.selectSysUserListPaging", paramMap));
    }

    /**
     * 사용자 접속 이력 리스트
     *
     * @param paramMap
     * @return
     * @throws Exception
     */
    @PostMapping(value = "/selectConectHistList.api")
    @ApiOperation(value = "접속이력 리스트 출력", notes = "현재 META에 접속했던 모든 계정의 이력을 출력합니다.")
    @ApiImplicitParam(name = "paramMap", value = "", required = true, dataTypeClass = String.class)
    public ResponseEntity<?> selectConectHistList(@UserParam Map<String, Object> paramMap) throws Exception {
        return CommonResponse.statusResponse(HttpServletResponse.SC_OK, commonService.selectPaging("sysManage.selectConectHistListPaging", paramMap));
    }

    /**
     * 회원 상세 정보
     *
     * @param paramMap
     * @return
     * @throws Exception
     */
    @PostMapping(value = "/selectMberOneDetail.api")
    @ApiOperation(value = "회원상세", notes = "회원 상세 정보를 출력합니다.")
    @ApiImplicitParam(name = "paramMap", value = "", required = true, dataTypeClass = String.class)
    public ResponseEntity<?> selectMberOneDetail(@UserParam Map<String, Object> paramMap) throws Exception {
        return CommonResponse.statusResponse(HttpServletResponse.SC_OK, commonService.selectMap("sysManage.selectMberOneDetail", paramMap));
    }

    /**
     * 권한관리 권한목록 불러오기
     *
     * @param paramMap
     * @return
     * @throws Exception
     */
    @PostMapping(value = "/selectMberAuthList.api")
    @ApiOperation(value = "권한관리 권한목록 불러오기", notes = "권한관리 권한목록 불러오기.")
    @ApiImplicitParam(name = "paramMap", value = "", required = true, dataTypeClass = String.class)
    public ResponseEntity<?> selectMberAuthList(@UserParam Map<String, Object> paramMap) throws Exception {
        return CommonResponse.statusResponse(HttpServletResponse.SC_OK, commonService.selectMap("sysManage.selectMberAuthList", paramMap));
    }

    /**
     * 권한관리 권한수정
     *
     * @param paramMap
     * @return
     * @throws Exception
     */
    @PostMapping(value = "/updateMberAuth.api")
    @ApiOperation(value = "권한관리 권한수정", notes = "권한관리 권한수정")
    @ApiImplicitParam(name = "paramMap", value = "", required = true, dataTypeClass = String.class)
    public ResponseEntity<?> updateMberAuth(@UserParam Map<String, Object> paramMap) throws Exception {
		commonService.update("sysManage.updateMberAuth", paramMap);
        return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
    }
}
