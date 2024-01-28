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
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.google.api.client.json.Json;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import kr.so.configuration.security.JwtTokenProvider;
import kr.so.mvc.service.CommonService;
import kr.so.service.CommunityService;
import kr.so.service.FileService;
import kr.so.util.CommonResponse;
import kr.so.util.CommonUtil;
import kr.so.util.UserParam;

@Api(tags = "공자 커뮤니티 관리 - 공자커뮤니티")
@RestController
@RequestMapping("/communityController")
public class CommunityController {
    private Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    CommunityService communityService;

    @Autowired
    CommonService commonService;

    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @Autowired
    FileService fileService;

    /**
     * VOD manage List 조회
     *
     * @param paramMap
     * @return
     * @throws Exception
     */
    @PostMapping(value = "/selectCommunityList.api")
    @ApiOperation(value = "VOD manage List 출력", notes = "현재 DB에 저장된 모든 Vod 관리 리스트를 출력합니다.")

	
    public ResponseEntity<?> selectCommunityList(@UserParam Map<String, Object> paramMap) throws Exception {
        return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
                commonService.selectPaging("sysCommunity.selectCommunityListPaging", paramMap));
    }

    /**
     * VOD Manage register
         * @Param paramMap : {"communitySj":"", "registId":"", "inquireCo":"", "hideAt":"", "registDt":"", "communityImageSeq":"", "communityVideoSeq":"", "communityCn":"", "communityTag":""}
     */
    @PostMapping(value = "/registerCommunity.api", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "VOD 관리파일을 VOD 관리 테이블에 INSERT, VOD 태그를 VOD 관리 태그 테이블에 저장", notes = "VOD 관리 파일을 등록합니다.")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "communityImageFile", required = true, paramType = "formData", value = "files", dataTypeClass = Object.class),
            @ApiImplicitParam(name = "communityVideoFile", required = true, paramType = "formData", value = "files", dataTypeClass = Object.class),
            @ApiImplicitParam(name = "paramMap", required = true, paramType = "formData", dataTypeClass = Json.class, value = "{\n" +
                    "  \"communitySj\":\"test\",\n" +
                    "  \"communityCn\":\"test2\"\n" +
                    "}", example = "{\n" +
                    "  \"communitySj\":\"test\",\n" +
                    "  \"communityCn\":\"test2\"\n" +
                    "}")})
    public ResponseEntity<?> registerCommunity(
            @RequestPart(value = "communityImageFile", required = false) MultipartFile[] communityImageFile,
            @RequestPart(value = "communityVideoFile", required = false) MultipartFile[] communityVideoFile,
            @RequestPart(value = "paramMap", required = false) Map<String, Object> paramMap,
            HttpServletRequest req) throws Exception {
        String communityImageFileExtension = StringUtils.getFilenameExtension(communityImageFile[0].getOriginalFilename());
        String communityVideoFileExtension = StringUtils.getFilenameExtension(communityVideoFile[0].getOriginalFilename());

		String[] allowedExtensions = {"jpg", "jpeg", "png"};
		if(!Arrays.asList(allowedExtensions).contains(communityImageFileExtension)){
            return CommonResponse.statusResponse(HttpServletResponse.SC_BAD_REQUEST, "썸네일 이미지 파일형식은 jpg, jpeg, png 확장자만 첨부 가능합니다.");
        }

        if (!(communityVideoFileExtension.equals("mp4"))) {
            return CommonResponse.statusResponse(HttpServletResponse.SC_BAD_REQUEST, "첨부영상 파일형식은 mp4만 첨부 가능합니다.");
        }

        long communityVideoFileSize = communityVideoFile[0].getSize();

        if (communityVideoFileSize > (1024 * 1024 * 1024 * 2L)) {
            return CommonResponse.statusResponse(HttpServletResponse.SC_BAD_REQUEST, "첨부영상 파일 용량은 최대 2G까지만 첨부 가능합니다.");
        }

        Map<String, Object> sessionMap = CommonUtil.loginSession.get(jwtTokenProvider.getUserPk(jwtTokenProvider.resolveToken(req)));
        paramMap.put("user", sessionMap);
        fileService.fileRegist(communityImageFile, paramMap);
        String communityImageFileSeq = (String) paramMap.get("fileSeq");
        paramMap.put("communityImageFileSeq", communityImageFileSeq);
        paramMap.remove("fileSeq");
        fileService.fileRegist(communityVideoFile, paramMap);
        String communityVideoFileSeq = (String) paramMap.get("fileSeq");
        paramMap.put("communityVideoFileSeq", communityVideoFileSeq);
        paramMap.remove("fileSeq");
        commonService.insert("sysCommunity.insertCommunity", paramMap);
        return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
    }

    /**
     * VOD Manage Detail 조회
     *
     * @param paramMap vod 관리 일련번호(communitySeq) 들어있는 맵
     * @return Map<String, Object> resultMap VOD 관리 테이블
     * @throws Exception
     */
    @PostMapping(value = "/selectCommunityDetail.api")
    @ApiOperation(value = "VOD 관리 상세보기 출력", notes = "현재 DB에 저장된 VOD 관리 테이블을 출력합니다.")
    public ResponseEntity<?> selectCommunityDetail(@RequestBody Map<String, Object> paramMap) throws Exception {
        Map<String, Object> resultMap = commonService.selectMap("sysCommunity.selectCommunity", paramMap);

        if (!CommonUtil.isEmpty(resultMap.get("communityImageSeq"))) {
            paramMap.put("fileSeq", resultMap.get("communityImageSeq"));
            List<Map<String, Object>> communityImageFileList = commonService.selectList("file.selectFileDetail", paramMap);

            resultMap.put("communityImageFileList", communityImageFileList);
        }

        if (!CommonUtil.isEmpty(resultMap.get("communityVideoSeq"))) {
            paramMap.put("fileSeq", resultMap.get("communityVideoSeq"));
            List<Map<String, Object>> communityVideoFileList = commonService.selectList("file.selectFileDetail", paramMap);

            resultMap.put("communityVideoFileList", communityVideoFileList);
        }

        Map<String, Object> communityTagMap = commonService.selectMap("sysCommunity.selectCommunityTag", paramMap);
        resultMap.put("communityTagMap", communityTagMap);

        return CommonResponse.statusResponse(HttpServletResponse.SC_OK, resultMap);
    }

    /**
     * VOD manage List 숨기기
     *
     * @param paramMap
     * @return
     * @throws Exception
     */
    @PostMapping(value = "/hideCommunityList.api")
    @ApiOperation(value = "VOD manage List 숨기기", notes = "Vod 관리 리스트 hide_at 컬럼값을 Y로 변경합니다.")
    public ResponseEntity<?> hideCommunityList(@UserParam Map<String, Object> paramMap) throws Exception {
		commonService.update("sysCommunity.hideCommunityList", paramMap);
        return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
    }

    /**
     * VOD manage List 숨김해제
     *
     * @param paramMap
     * @return
     * @throws Exception
     */
    @PostMapping(value = "/showCommunityList.api")
    @ApiOperation(value = "VOD manage List 숨김해제", notes = "Vod 관리 리스트 hide_at 컬럼값을 N으로 변경합니다.")
    public ResponseEntity<?> showCommunityList(@UserParam Map<String, Object> paramMap) throws Exception {
		commonService.update("sysCommunity.showCommunityList", paramMap);
        return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
    }

    /**
     * VOD manage 좋아요 클릭
     *
     * @param paramMap {"communitySeq": "VOD_MANAGE_00000001"}
     * @return
     * @throws Exception
     */
    @PostMapping(value = "/clickCommunityLike.api", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "VOD manage 좋아요 버튼 클릭", notes = "VOD manage 좋아요 버튼 클릭: 반영된 적 없으면 좋아요 +1, 이미 반영되어 있으면 좋아요-1")
    @ApiImplicitParams({
    @ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = Json.class, value = "{\r\n" + //
            "\t\"communitySeq\": \"VOD_MANAGE_00000003\"\r\n" + //
            "}", example = "{\r\n" + //
            "\t\"communitySeq\": \"VOD_MANAGE_00000003\"\r\n" + //
            "}")})
    public ResponseEntity<?> clickCommunityLike(@RequestBody Map<String, Object> paramMap, HttpServletRequest req) throws Exception {
        Map<String, Object> sessionMap = CommonUtil.loginSession.get(jwtTokenProvider.getUserPk(jwtTokenProvider.resolveToken(req)));
        paramMap.put("user", sessionMap);
        Map<String, Object> resultMap = commonService.selectMap("sysCommunity.selectCommunityLike", paramMap);
        String communitySeqByLikeTable = (String) resultMap.get("communitySeqByLikeTable");
        if (ObjectUtils.isEmpty(communitySeqByLikeTable)) {
            commonService.insert("sysCommunity.insertCommunityLike", paramMap);
        } else {
            commonService.delete("sysCommunity.deleteCommunityLike", paramMap);
        }
        return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
    }

    /**
     * VOD manage 클릭
     *
     * @param paramMap {"communitySeq": "VOD_MANAGE_00000001"}
     * @return
     * @throws Exception
     */
    @PostMapping(value = "/increaseCommunityInquireCo.api")
    @ApiOperation(value = "VOD manage 게시물 클릭", notes = "VOD manage 게시물 클릭: 조회수 + 1")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = Json.class, value = "{\r\n" + //
                    "\t\"communitySeq\": \"VOD_MANAGE_00000003\"\r\n" + //
                    "}", example = "{\r\n" + //
                    "\t\"communitySeq\": \"VOD_MANAGE_00000003\"\r\n" + //
                    "}")})
    public ResponseEntity<?> increaseCommunityInquireCo(@RequestBody Map<String, Object> paramMap, HttpServletRequest req) throws Exception {
        Map<String, Object> sessionMap = CommonUtil.loginSession.get(jwtTokenProvider.getUserPk(jwtTokenProvider.resolveToken(req)));
        paramMap.put("user", sessionMap);
        Map<String, Object> resultMap = commonService.selectMap("sysCommunity.selectCommunity", paramMap);
        int inquireCo = Integer.parseInt(resultMap.get("inquireCo").toString());
        inquireCo++;
        paramMap.put("inquireCo", String.valueOf(inquireCo));
        commonService.update("sysCommunity.increaseCommunityInquireCo", paramMap);
        return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
    }

    /**
     * VOD manage 비디오 재생버튼 클릭
     *
     * @param paramMap {"communitySeq": "VOD_MANAGE_00000001"}
     * @return
     * @throws Exception
     */
    @PostMapping(value = "/playCommunityVideo.api")
    @ApiOperation(value = "VOD manage 비디오 재생버튼 클릭")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = Json.class, value = "{\r\n" + //
                    "\t\"communitySeq\": \"VOD_MANAGE_00000003\"\r\n" + //
                    "}", example = "{\r\n" + //
                    "\t\"communitySeq\": \"VOD_MANAGE_00000003\"\r\n" + //
                    "}")})
    public ResponseEntity<?> playCommunityVideo(@RequestBody Map<String, Object> paramMap, HttpServletRequest req) throws Exception {
        Map<String, Object> sessionMap = CommonUtil.loginSession.get(jwtTokenProvider.getUserPk(jwtTokenProvider.resolveToken(req)));
        paramMap.put("user", sessionMap);
        Map<String, Object> communityMap = commonService.selectMap("sysCommunity.selectCommunity", paramMap);
        if (!CommonUtil.isEmpty(communityMap.get("communityVideoSeq"))) {
            paramMap.put("fileSeq", communityMap.get("communityVideoSeq"));
            List<Map<String, Object>> fileList = commonService.selectList("file.selectFileDetail", paramMap);
            communityMap.put("fileList", fileList);
        }
        return CommonResponse.statusResponse(HttpServletResponse.SC_OK, communityMap);
    }
}





































