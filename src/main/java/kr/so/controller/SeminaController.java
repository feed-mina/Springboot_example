package kr.so.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import kr.so.mvc.service.CommonService;
import kr.so.service.SeminaService;
import kr.so.util.CamelHashMap;
import kr.so.util.CommonResponse;
import kr.so.util.JSONObject;
import kr.so.util.UserParam;

@Api(tags = " Semina - 세미나")
@RestController
@RequestMapping("/seminaController")
public class SeminaController {

    private Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    CommonService commonService;

    @Autowired
    SeminaService seminaService;

   
    /**
     * 세미나 List
     *
     * @param paramMap
     * @return
     * @throws Exception
     */
    @PostMapping(value = "/selectSeminaList.api")
    @ApiOperation(value = "모든 세미나 리스트 출력", notes = "현재 DB에 저장된 모든 세미나 리스트를 출력합니다.")
    public ResponseEntity<?> selectSeminaList(@RequestBody Map<String, Object> paramMap) throws Exception {
        return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
                commonService.selectPaging("sysSemina.selectSeminaListPaging", paramMap));
    }

    /**
     * 세미나 조회
     *
     * @param paramMap
     * @return
     * @throws Exception
     */
    @PostMapping(value = "/selectSemina.api")
    @ApiOperation(value = "세미나 출력", notes = "DB의 세미나 테이블, 세미나키워드 테이블을 출력합니다.")
    @ApiImplicitParam(name = "paramMap", value = "강의 시퀀스(seminaSeq) 들어있는 맵", example = "{'seminaSeq', 'SEMINA_00000001'}", required = true, dataTypeClass = Map.class)
    public ResponseEntity<?> selectSemina(@RequestBody Map<String, Object> paramMap) throws Exception {
        return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
                (Map) commonService.selectOne("sysSemina.selectSemina", paramMap));
    }

    /**
     * 세미나 Insert
     */
    @PostMapping(value = "/insertSemina.api")
    @ApiOperation(value = "세미나 INSERT", notes = "세미나를 등록합니다. (tb_semina, tb_semina_kwrd)")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "paramMap", required = true, paramType = "formData", dataTypeClass = JSONObject.class) })
    public ResponseEntity<?> insertSemina(@UserParam Map<String, Object> paramMap) throws Exception {
       seminaService.insertSemina(paramMap);
        return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
    }

    /**
     * 세미나 운영 List
     *
     * @param paramMap
     * @return
     * @throws Exception
     */
    @PostMapping(value = "/selectSeminaOperateList.api")
    @ApiOperation(value = "모든 세미나 운영 리스트 출력", notes = "현재 DB에 저장된 모든 세미나 운영 리스트를 출력합니다.")
    public ResponseEntity<?> selectSeminaOperateList(@RequestBody Map<String, Object> paramMap) throws Exception {
        return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
                commonService.selectPaging("sysSemina.selectSeminaOperateListPaging", paramMap));
    }

    /**
     * 세미나 Update
     */
    @PostMapping(value = "/updateSemina.api")
    @ApiOperation(value = "세미나 UPDATE", notes = "세미나를 수정합니다.")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "paramMap", required = true, paramType = "formData", dataTypeClass = JSONObject.class) })
    public ResponseEntity<?> updateSemina(@UserParam Map<String, Object> paramMap) throws Exception {
        seminaService.updateSemina(paramMap);
        return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
    }

    /**
     * 확정을 위한 세미나 Update
     */
    @PostMapping(value = "/updateSeminaForConfirm.api")
    @ApiOperation(value = "세미나 UPDATE - 확정", notes = "세미나를 확정합니다.")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "paramMap", required = true, paramType = "formData", dataTypeClass = JSONObject.class) })
    public ResponseEntity<?> updateSeminaForConfirm(@UserParam Map<String, Object> paramMap) throws Exception {

        if(paramMap.get("canclNtcnArray") != null) {
            ArrayList<String> canclNtcnList = (ArrayList<String>) paramMap.get("canclNtcnArray");
            String canclNtcnListStr = String.join(",", canclNtcnList);
            paramMap.put("canclNtcnListStr", canclNtcnListStr);

			// 세미나 취소 알람 처리
			List<Map<String, Object>> applyUserList = commonService.selectList("sysSemina.selectSeminaApplyList", paramMap);
			List<String> userSeqList = new ArrayList<>();
			for (Map<String, Object> applyUser : applyUserList) {
				if (applyUser.containsKey("atnlcUserSeq")) {
					userSeqList.add(applyUser.get("atnlcUserSeq").toString());
				}
			}
			//alarmService.insertSeminaCancelAlarm(
				//canclNtcnList, 
			//	userSeqList, 
			//	(String) paramMap.get("seminaNm"), 
			//	(String) paramMap.get("canclDc")
		//	);
        }
        commonService.update("sysSemina.updateSemina", paramMap);
        return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
    }

    /**
     * 세미나 신청자 List
     *
     * @throws Exception
     */
    @PostMapping(value = "/selectSeminaApplyList.api")
    @ApiOperation(value = "세미나 참여자 목록", notes = "해당 세미나의 참여자들을 조회합니다.")
    @ApiImplicitParam(name = "paramMap", value = "세미나 시퀀스(seminaSeq) 들어있는 맵", dataTypeClass = Map.class)
    public ResponseEntity<?> selectSeminaApplyList(@RequestBody Map<String, Object> paramMap) throws Exception {
        return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
                commonService.selectList("sysSemina.selectSeminaApplyList", paramMap));
    }

    /**
     * 세미나 참여자 List
     *
     * @throws Exception
     */
    @PostMapping(value = "/selectSeminaParticipantsList.api")
    @ApiOperation(value = "세미나 참여자 목록", notes = "해당 세미나의 참여자들을 조회합니다.")
    @ApiImplicitParam(name = "paramMap", value = "세미나 시퀀스(seminaSeq) 들어있는 맵", dataTypeClass = Map.class)
    public ResponseEntity<?> selectSeminaParticipantsList(@RequestBody Map<String, Object> paramMap) throws Exception {
        return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
                commonService.selectList("sysSemina.selectSeminaParticipantsList", paramMap));
    }

    @PostMapping(value = "/getCurrentUserListExcel.api")
    @ApiOperation(value = "현재 세미나 신청자 다운로드", notes = "현재 세미나 신청자 성명 및 사용자번호 엑셀 다운로드")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "paramMap", value = "{'seminaApplyUserArray': seminaApplyUserArray}", example = "{'seminaApplyUserArray', {'김기열(000032)',''강한나(000033)' }}", required = true, dataTypeClass = String.class) })
    public void getCurrentUserListExcel(@RequestBody Map<String, Object> paramMap, HttpServletResponse response)
            throws Exception {
        List<Map<String, Object>> datas = new ArrayList<>();

        Map<String, Object> userListMap = new CamelHashMap();
        userListMap.put("headers", new String[] { "순번", "이름", "소속" });

        ArrayList<String> seminaApplyUserList = (ArrayList<String>) paramMap.get("seminaApplyUserArray");

        List<Map<String, Object>> listMap = new ArrayList<>();
        seminaApplyUserList.forEach((el) -> {
            int index = 1;
            String userSeq = el.substring(el.indexOf("(") + 1, el.indexOf(")"));
            String userName = el.substring(0, el.indexOf("("));
            Map<String, Object> seminaUserMap = new HashMap<>();
            seminaUserMap.put("이름", userName);
            seminaUserMap.put("소속", userSeq);
            listMap.add(seminaUserMap);
        });

        userListMap.put("list", listMap);
        datas.add(userListMap);
      //  excelService.exportDataToExcel("현재 수강신청자 현황", datas, true, response);
    }

    @PostMapping(value = "/getCurrentParticipantsListExcel.api")
    @ApiOperation(value = "현재 세미나 참여자 다운로드", notes = "현재 세미나 참여자 성명 및 사용자번호 엑셀 다운로드")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "paramMap", value = "{'seminaParticipantUserArray': seminaParticipantUserArray}", example = "{'seminaParticipantUserArray', {'김기열(000032)',''강한나(000033)' }}", required = true, dataTypeClass = String.class) })
    public void getCurrentParticipantsListExcel(@RequestBody Map<String, Object> paramMap, HttpServletResponse response)
            throws Exception {
        List<Map<String, Object>> datas = new ArrayList<>();

        Map<String, Object> userListMap = new CamelHashMap();
        userListMap.put("headers", new String[] { "순번", "이름", "소속" });

        ArrayList<String> seminaParticipantUserList = (ArrayList<String>) paramMap.get("seminaParticipantUserArray");
        List<Map<String, Object>> listMap = new ArrayList<>();

        seminaParticipantUserList.forEach((el) -> {
            int index = 1;
            String userSeq = el.substring(el.indexOf("(") + 1, el.indexOf(")"));
            String userName = el.substring(0, el.indexOf("("));
            Map<String, Object> lctreUserMap = new HashMap<>();
            lctreUserMap.put("이름", userName);
            lctreUserMap.put("소속", userSeq);
            listMap.add(lctreUserMap);
        });

        userListMap.put("list", listMap);
        datas.add(userListMap);
       // excelService.exportDataToExcel("현재 세미나 참여자 현황", datas, true, response);
    }

    /**
     * 세미나 Delete
     *
     * @param paramMap 세미나 시퀀스(seminaSeq) 들어있는 맵
     */
    @PostMapping(value = "/deleteSemina.api")
    @ApiOperation(value = "세미나 DELETE", notes = "세미나를 DB에서 완전히 삭제합니다.")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "paramMap", required = true, paramType = "formData", example = "{'seminaSeq': 'SEMINA_00000013'}", dataTypeClass = JSONObject.class) })
    public ResponseEntity<?> deleteLctre(@RequestBody Map<String, Object> paramMap) throws Exception {
        seminaService.deleteSemina(paramMap);
        return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
    }
}
