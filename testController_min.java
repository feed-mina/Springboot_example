package kr.so.controller;


import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URLEncoder;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpServerErrorException;

import kr.so.config.security.JwtTokenProvider;
import kr.so.service.CommonService;
import kr.so.service.FileService;
import kr.so.service.TranslateService;
import kr.so.util.CamelHashMap;
import kr.so.util.CommonResponse;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

@Api(tags = " 공통 - 코드", description = "공통 코드를 불러옵니다")
@RestController
@RequestMapping("/test2")
public class testController_min {
	private Logger log = LoggerFactory.getLogger(this.getClass());

	@Autowired
	CommonService commonService;

	@Autowired
	FileService fileService;

	@Autowired
	JwtTokenProvider jwtTokenProvider;

	@Autowired
	TranslateService translateService;

 @PostMapping(value = "/userInfo.api")
  @ApiOperation(value="유저 기본데이터", notes="유저 기본데이터")
  @ApiImplicitParam(name="paramMap", required=true, dataTypeClass=String.class, value="'userSeq':'USERSEQ_000123'",example="{}")
  
  public ResponseEntity<?> userInfo(@RequiredBody  Map<String, Object> paramMap) throws Exception{
    // 키가 String이고 Object를 받는 Map으 HashMap 매서드로 지정
    Map<String, Object> tmpMap = new HashMap<>();
    // userSeq를 키로 하고 userSeq키를 가진 paramMap을 tmpMap으로 간주한다.
    // String을 키로 한 Object객체를 가진 paramMap이다. paramMap은 userSeq를 키로 가진다. 그 MAp객체에 usrSeq를 키로 또 삼은 객체를 tmpMap이라고 하자.
		tmpMap.put("userSeq", paramMap.get("userSeq"));
    // paramMap 에 key를 user로 가진 tmpMap객체로 갖는다. 
    paramMap.put("user", tmpMap);
    // String을 key로 하고 Object를 가진 result 객체를 user.selectUserInfo sql문에 selectMap을 필터링 하여 가진다.
    Map<String, Object> result = commonService.selectMap("user.selectUserInfo", paramMap);
    // String을 키로 가지고 object를 객체로 가진 객체들을 List로 갖는 selectUSerStplatList 변수가 있다. 
   List<Map<String, Object>> selectUserStplatList = commonService.selectList("user.selectUSerStplat", paramMap);

  // result 맵에 키를 stplatCodes를 selectUserStplatList객체로 둔다.
   result.put("stplatCodes", selectUserStplatList);
  
// userManaage sql의 UserOneGrade값을 paramMap 값으로 객체 매핑을 하여 paramMap을 잡는다 ?? 
   paramMap = commonService.selectMap("userManage.selectUserOneGrade", paramMap);

   // SC_OK 결과와 result를 화면에 함께 보낸다.
   return CommonResponse.statusResponse(HttpServletResponse.SC_OK, result);
    
    
  }

  @PostMapping(value = "/selectCmmnCode.api")
  @ApiOperation(value = "공통코드 리스트 출력")
  @ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class, value="{''}")
  public ResponseEntity<?> selectCmmnCode(@RequestBody Map<String, Object> paramMap) throws Exception{
    // String을 키로 가지고 object가 value인 Map 형태가 paramMap 형태이다. cmmn테이블의 selectCmmnCode 쿼리를 paramMap 결과에 담아서 selectList로 리스트 배열 형태로 결과가 나온다.
    return CommonResponse.statusResponse(HttpServletResponse.SC_OK,  commonService.selectList("cmmn.selectCmmnCode", paramMap));
  }

  @PostMapping(value = "/updateCmmnCode.api")
  @ApiOperation(value="공통 코드 업데이트")
  @ApiImplicitParam(name="paramMap", required = true, dataTypeClass = String.class, value="")
  public ResponseEntity<?> updateCmmnCode(@RequestBody Map<String, Object> paramMap) throws Exception{
    // cmmn테이블의 updateCmmnCode쿼리를 key로 paramMap을 value로 잡아서 리스트 배열에 보내 결과를 보낸다. paramMap은 키가 String 이고 Object가 value이다.
    return CommonResponse.statusResponse(HttpServletResponse.SC_OK, commonService.selectList("cmmn.updateCmmnCode", paramMap));
  } 
											
  

  @GetMapping(value = "/fileDowndload.api")
  @ApiOperation(value="999-1 파일 다운로드(비로그인 for get)", notes="파일 다운로드 (비 로그인 app에서 사용 for get)")
  @ApiImplicitParam(name="fileSeq", value="FILE_0000176", required = true, dataTypeClass = String.class)
  public void fileDownloadForGet(
    @RequestParam String fileSeq, 
    @RequestParam(defaultValue = "1") String fileSn,
    HttpServletResponse response) throws Exception{
      // 데이터타입이 String이고 fileSeq와 fileSn이 요청하는 값으로 필요하다.
      // String을 키로 Object를 맵으로 한 paramMap을 CamelHashMap 매서드로 paramMap을 지정한다.
      Map<String, Object> paramMap = new CamelHashMap();
      // paramMap 객체에 string 키값으로 fileSeq 객체를, filesn 을 키값으로 fileSn객체 값을 paramMap에 적용한다.
      paramMap.put("fileSeq", fileSeq);
      paramMap.put("fileSn", fileSn);
      // String을 키로 Object를 value로 가진 MAp객체를 fileMap으로 지정한다. fileMap값을 fileService에서 fileMap매서드로 paramMap객체를 Map으로 받은 값이라 지정하자.
      Map<String , Object> fileMap = fileService.fileMap(paramMap);
      // fileCours를 키로 해서 fileMap에서 객체를 가져온다. 이걸 fileCours라고 지정한다.
      String fileCours = (String) fileMap.get("fileCours");
      // uFile을 File 객체로 받고 new File 매서드에 fileCours를 변수로 넣어 객체를 지정한다.
      File uFile = new File(fileCours);
      // 파일객체의 길이를 fsize라고 지정한다.
      int fSize = (int) uFile.length();
      //파일 사이즈가 0 이상일때 BufferInputStream 객체를 in이라고 준다. in(BufferedInputStream객체)는 FileInPutStream 매서드에서 파일 객체를 받은걸 말한다. 
      if(fSize>0){
        BufferedInputStream in = new BufferedInputStream(new FileInputStream(uFile));
        // mimeType 을 application/octect-stream 과 charset=utf-8 형식이라고 하고 string 값으로 지정한다.
        String mimetype = "application/octect-stream; charset=utf-8;";

        response.setBufferSize(fSize);
        response.setContentType(mimetype);

        // 응답에 fsize를 버퍼사이즈로 지정하고 ContentType에 mimetype으로 지정해준다.
        
        // 브라우저 별 한글 인코딩
        // fileMap 객체에 있는 originFileNm 키를 fileMap으로 받는다. 이걸 originFileNm 이라고 가정한다.
        String originFileNm = (String) fileMap.get("originFileNm");
        // 이름을 urlEncoder로 인코딩한다. UTF 8 방법으로 originFileNm을 인코딩한다. // 을 %20으로 바꾼다.
        String name = URLEncoder.encode(originFileNm,"UTF-8").replaceAll("\\", "%20");
        // response의 Header값에 Content-Disposition으로 mimetype을 지정한다. setContentLength 매서드로 파일사이즈를 response에 지정하게 한다.
        response.setHeader("Content-Disposition", mimetype);
        response.setContentLength(fSize);
        // fileCopyUtils를 사용하여 파일 경로로 준 파일을 response에 getOutputStream값을 복사한다.

        FileCopyUtils.copy(in, response.getOutputStream());
        // originFileCours경로로 둔 bufferedFileStream을 in이라고 했는데 그 in값을 종료한다.
        in.close();
        // response객체에 getOutputStream 매서드에서 flush 매서드를 사용한다. 
        // getOUtputStream매서드를 종료시킨다.
        response.getOutputStream().flush();
        response.getOutputStream().close();
      }
    }
  
}