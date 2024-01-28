package kr.so.controller;

import kr.so.mvc.service.CommonService;
import kr.so.util.CamelHashMap;
import kr.so.util.CommonResponse;
import kr.so.util.UserParam;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;

@Api(tags = "10 Like - 유저 좋아요 ")
@RestController
@RequestMapping("/follow")
public class LikeController {
    @Autowired
    CommonService commonService;

    @PostMapping(value = "/checkUserLike.api")
    @ApiOperation(value = "유저 좋아요했는지 체크.", notes = " 좋아요 한적있으면 'Y', 아니면 'N' ")
    @ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class
            ,value = "{\n" +
            "  \"fromUserSeq\": \"USER_00000015\"\n" +
            "}"
            ,example = "{\n" +
            "  \"fromUserSeq\": \"USER_00000015\"\n" +
            "}"
    )
    public ResponseEntity<?> checkUserLike(@UserParam Map<String, Object> paramMap, HttpServletRequest req) throws Exception {
        CamelHashMap resultMap = new CamelHashMap();
        if (ObjectUtils.isEmpty(commonService.selectMap("like.selectLikeCheck", paramMap))) {
            // 좋아요 X
            resultMap.put("likeFlag", "N");
        } else {
            // 좋아요 O
            resultMap.put("likeFlag", "Y");
        }

        return CommonResponse.statusResponse(HttpServletResponse.SC_OK, resultMap);
    }

    @PostMapping(value = "/userLike.api")
    @ApiOperation(value = "유저 좋아요.", notes = " 데이터없으면 insert, 있으면 delete ")
    @ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class
            ,value = "{\n" +
            "  \"fromUserSeq\": \"USER_00000015\"\n" +
            "}"
            ,example = "{\n" +
            "  \"fromUserSeq\": \"USER_00000015\"\n" +
            "}"
    )
    public ResponseEntity<?> challengeInsert(@UserParam Map<String, Object> paramMap, HttpServletRequest req) throws Exception {
        CamelHashMap resultMap = new CamelHashMap();
        if (ObjectUtils.isEmpty(commonService.selectMap("like.selectLikeCheck", paramMap))) {
            // 좋아요 insert
            commonService.insert("like.insertLike", paramMap);
            resultMap.put("msg", "좋아요 했습니다.");
        } else {
            // 좋아요 취소 delete
            commonService.delete("like.deleteLike", paramMap);
            resultMap.put("msg", "좋아요 취소했습니다.");
        }

        return CommonResponse.statusResponse(HttpServletResponse.SC_OK, resultMap);
    }

    @PostMapping(value = "/likeCount.api")
    @ApiOperation(value = "좋아요 받은 갯수.", notes = " 현재 내가 좋아요를 받은 갯수 ")
    @ApiImplicitParam(name = "paramMap", required = true, dataTypeClass = String.class
            ,value = "{\n" +
            "  \"fromUserSeq\": \"USER_00000015\"\n" +
            "}"
            ,example = "{\n" +
            "  \"fromUserSeq\": \"USER_00000015\"\n" +
            "}"
    )
    public ResponseEntity<?> myLikeCount(@UserParam Map<String, Object> paramMap, HttpServletRequest req) throws Exception {
        return CommonResponse.statusResponse(HttpServletResponse.SC_OK, commonService.selectMap("like.selectLikeCount", paramMap));
    }

}
