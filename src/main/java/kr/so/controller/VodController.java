package kr.so.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileUrlResource;
import org.springframework.core.io.support.ResourceRegion;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpRange;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import kr.so.configuration.security.JwtTokenProvider;
import kr.so.mvc.service.CommonService;
import kr.so.service.FileService;
import kr.so.service.LctreService;
import kr.so.service.SeminaService;
import kr.so.util.CamelHashMap;
import kr.so.util.CommonResponse;
import kr.so.util.CommonUtil;
import kr.so.util.UserParam;

@Api(tags = " Vod - VOD 파일")
@RestController
@RequestMapping("/vodController")
public class VodController {

    private Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    LctreService lctreService;

    @Autowired
    CommonService commonService;

    @Autowired
    SeminaService seminaService;

    @Autowired
	JwtTokenProvider jwtTokenProvider;
	
    @Autowired
    FileService fileService;

    /**
     * LctreFx VOD Insert
     * @Param paramMap : {"lctreSeq":"LCTRE_00000091", "lctreSn":"0"} require
     */
    @PostMapping(value = "/insertVodFileForLctreFx.api", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "VOD파일일련을 강의일정테이블에 INSERT, VOD파일 저장", notes = "VOD를 등록합니다. video:multipart, paramMap: userSEq  {\"lctreSeq\":\"LCTRE_00000091\", \"lctreSn\":\"0\"}")
    public ResponseEntity<?> insertVodFileForLctreFx(
            @RequestPart(value = "video", required = true) MultipartFile[] video,
            @RequestParam(value = "paramMap", required = true) Map<String, Object> paramMap) throws Exception {
        Map<String, Object> user = new HashMap<>();
        user.put("userSeq", null);
        paramMap.put("user", user);
        lctreService.insertVodFileForLctreFx(video, paramMap);
        return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
    }

    /**
     * Semina VOD Insert
     * @Param paramMap : {"seminaSeq":"SEMINA_00000003"} require
     */
    @PostMapping(value = "/insertVodFileForSemina.api", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "VOD파일일련을 세미나테이블에 INSERT, VOD파일 저장", notes = "VOD를 등록합니다.  {\"seminaSeq\":\"SEMINA_00000003\"}")

    public ResponseEntity<?> insertVodFileForSemina(
            @RequestPart(value = "video", required = true) MultipartFile[] video,
            @RequestParam(value = "paramMap", required = true) Map<String, Object> paramMap,
			HttpServletRequest req) throws Exception {
		Map<String, Object> user = new HashMap<>();
		user.put("userSeq", null);
		paramMap.put("user", user);
		seminaService.insertVodFileForSemina(video, paramMap);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
	}

    /**
     * VOD 조회
     * @Param paramMap : {"fileSeq":"FILE_00000145", "fileDetailSn":"1"} require
     */
    @PostMapping(value = "/selectVod.api")
    @ApiOperation(value = "VOD 조회", notes = "VOD를 조회합니다.")
    public ResponseEntity<?> selectVod(@RequestBody Map<String, Object> paramMap) throws Exception {
        return CommonResponse.statusResponse(HttpServletResponse.SC_OK, commonService.selectMap("file.selectFileDetail", paramMap));
    }

    /**
     * VOD 담기
     * @Param paramMap : {"vodTypeSeq":"SEMINA_00000003"} require  // vodTypeSeq는 lctreSeq 혹은 seminaSeq
     */
    @PostMapping(value = "/getVodInBasket.api")
    @ApiOperation(value = "VOD 담기", notes = "VOD를 바구니에 담습니다.")
    public ResponseEntity<?> getVodInBasket(@RequestBody Map<String, Object> paramMap, HttpServletRequest req) throws Exception {
        Map<String, Object> sessionMap = CommonUtil.loginSession
                .get(jwtTokenProvider.getUserPk(jwtTokenProvider.resolveToken(req)));
        paramMap.put("user", sessionMap);
        commonService.insert("sysVod.insertVodBsk", paramMap);
        return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
    }

    /**
     * VOD 담기취소
     * @Param paramMap : {"vodTypeSeq":"SEMINA_00000003"} require  // vodTypeSeq는 lctreSeq 혹은 seminaSeq
     */
    @PostMapping(value = "/deleteVodInBasket.api")
    @ApiOperation(value = "VOD 담기취소", notes = "VOD를 바구니에서 꺼냅니다.")
	public ResponseEntity<?> deleteVodInBasket(@RequestBody Map<String, Object> paramMap, HttpServletRequest req) throws Exception {
		Map<String, Object> sessionMap = CommonUtil.loginSession
				.get(jwtTokenProvider.getUserPk(jwtTokenProvider.resolveToken(req)));
		paramMap.put("user", sessionMap);
		commonService.delete("sysVod.deleteVodBsk", paramMap);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
	}

	/**
	 * VOD 재생 로그남기기
	 * @Param 
	 * vodFileSeq : "FILE_00000202"
	 */
	@PostMapping(value = "/insertPlayVideo.api")
	public ResponseEntity<?> viewVideo(@UserParam Map<String, Object> paramMap) throws Exception {
		commonService.insert("sysVod.insertPlayVideo", paramMap);
		return CommonResponse.statusResponse(200);
	}

	/**
	 * VOD 재생하기
	 * @Param /playVideo.api?fileSeq=FILE_00000206
	 */
	@GetMapping(value = "/playVideo.api")
	public ResponseEntity<ResourceRegion> playVideo(@RequestHeader HttpHeaders httpHeaders,
			@RequestParam String fileSeq) throws Exception {
		
		if(fileSeq == null || "".equals(fileSeq)){
			log.info("fileSeq is null or empty >> " + fileSeq);
			return null;
		}
		Map<String, Object> paramaMap = new CamelHashMap();
		paramaMap.put("fileSeq", fileSeq);
		Map<String, Object> com = fileService.fileMapCache(paramaMap, fileSeq);
		String fileCours = (String) com.get("fileCours");
		String orignlFileNm = (String) com.get("orignlFileNm");
		

		FileUrlResource fileUrlResource = new FileUrlResource(fileCours);

		final long chunkSize = 5 * 1024 * 1024; // 5M byte
		long contentLength = fileUrlResource.contentLength();
		ResourceRegion region;

		if (httpHeaders.getRange().isEmpty()) {
			region = new ResourceRegion(fileUrlResource, 0, Long.min(chunkSize, contentLength));
		} else {
			HttpRange httpRange = httpHeaders.getRange().stream().findFirst().get();
			long start = httpRange.getRangeStart(contentLength);
			long end = httpRange.getRangeEnd(contentLength);
			long rangeLength = Long.min(chunkSize, end - start + 1);
			region = new ResourceRegion(fileUrlResource, start, rangeLength);
		}

		return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
				.cacheControl(CacheControl.maxAge(10, TimeUnit.MINUTES))
				.header("Accept-Ranges", "bytes")
				.contentType(MediaTypeFactory.getMediaType(orignlFileNm).orElse(MediaType.APPLICATION_OCTET_STREAM))
				.body(region);
	}
	
	@GetMapping(value = "/playVideoRefresh.api")
	public ResponseEntity<?> playVideoRefresh(@RequestParam String fileSeq) throws Exception {
		fileService.fileMapRefresh(fileSeq);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
	}
	
	/**
	 * vod 페이징 sjh
	 */
	@PostMapping(value = "/selectVodListPaging.api")
    @ApiOperation(value = "VOD 목록 페이징", notes = "VOD \uD398\uC774\uC9D5")
	public ResponseEntity<?> selectVodListPaging(@RequestBody Map<String, Object> paramMap, HttpServletRequest req)
			throws Exception {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectPaging("sysVod.selectVodListPaging", paramMap));
	}
	
	/**
	 * 유저가 콜하는 vod목록
	 */
	@PostMapping(value = "/selectVodList.api")
    @ApiOperation(value = "유저별 VOD 목록, 신청한 강의중에서 고름", notes = "VOD \uD398\uC774\uC9D5")
	public ResponseEntity<?> selectVodList(@UserParam Map<String, Object> paramMap, HttpServletRequest req)
			throws Exception {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, commonService.selectList("sysVod.selectVodList", paramMap));
	}
	
}