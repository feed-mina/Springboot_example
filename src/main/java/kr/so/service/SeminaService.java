package kr.so.service;

import kr.so.dao.CommonDao;
import kr.so.util.CommonResponse;
import kr.so.util.CommonUtil;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.util.*;

@Service
public class SeminaService {

    @Autowired
    private CommonDao commonDao;

    @Autowired
    private FileService fileService;

    public boolean insertSemina(Map<String, Object> paramMap) throws Exception {
        List<String> requiredList = Arrays.asList(
                "seminaKndCode",    //세미나종류코드
                "useLangCd",        //세미나언어코드
                "seminaNm",			//세미나명
                "progrsUserSeq",	//진행이용자일련
                "seminaStyleSe",    //세미나 스타일
                "seminaDe",			//세미나일자
                "startHour",        //세미나 시작 시간
                "startMinute",      //세미나 시작 분
                "endHour",			//세미나 종료 시간
                "endMinute",		//세미나 종료 분
                "startPeriodDt",	//모집기간 시작일자
                "startPeriodHour",	//모집기간 시작시간
                "startPeriodMinute",//모집기간 시작분
                "endPeriodDt",      //모집기간 종료일자
                "endPeriodHour",	//모집기간 종료시간
                "endPeriodMinute",  //모집기간 종료분
                "atnlcAuthorArray",	//수강권한배열 -> 회원 종류 -> length로 카운팅
                "atnlcCo",			//수강수
                "seminaKeywordArray"//검색 키워드 -> length로 카운팅
        );
        if (!CommonUtil.validation(paramMap, requiredList)) {
            return false;
        }

        insert("sysSemina.insertSemina", paramMap);
        insert("sysSemina.insertSeminaKwrd", paramMap);
        return true;
    }

    public int insert(String sqlId, Map<String, Object> paramMap) throws Exception {
        if(sqlId.equals("sysSemina.insertSemina")) {
            Map<String, Object> parsedMap = parseMapBetweenFrontAndDbForSeminaTable(paramMap);
            return commonDao.insert(sqlId, parsedMap);
        } else if(sqlId.equals("sysSemina.insertSeminaKwrd")) {
            Map<String, Object> parsedMap = parseMapBetweenFrontAndDbForSeminaKwrdTable(paramMap);
            return commonDao.insert(sqlId, parsedMap);
        }
        return 0;
    }

    public Map<String, Object> parseMapBetweenFrontAndDbForSeminaTable (Map<String, Object> paramMap) {

        ArrayList<String> lctrUserSeqList = (ArrayList<String>) paramMap.get("lctrUserSeqArray");
        String lctrUserSeqListStr = String.join(",", lctrUserSeqList);
        paramMap.put("lctrUserSeqListStr", lctrUserSeqListStr);

        ArrayList<String> userKndCodeList = (ArrayList<String>) paramMap.get("atnlcAuthorArray");
        String userKndCodeStr = String.join(",", userKndCodeList);
        paramMap.put("userKndCodeStr", userKndCodeStr);

        String seminaDeStr = paramMap.get("seminaDe").toString().replaceAll("-", "");
        paramMap.put("seminaDeStr", seminaDeStr);

        String startPeriodDtStr = paramMap.get("startPeriodDt").toString().replaceAll("-", "");
        paramMap.put("startPeriodDtStr", startPeriodDtStr);

        String endPeriodDtStr = paramMap.get("endPeriodDt").toString().replaceAll("-", "");
        paramMap.put("endPeriodDtStr", endPeriodDtStr);
        return paramMap;
    }

    public Map<String, Object> parseMapBetweenFrontAndDbForSeminaKwrdTable (Map<String, Object> paramMap) {
        ArrayList<String> seminaKeywordList = (ArrayList<String>) paramMap.get("seminaKeywordArray");
        String seminaKeywordStr = String.join("&", seminaKeywordList);
        paramMap.put("seminaKeywordStr", seminaKeywordStr);
        return paramMap;
    }

    public void insertVodFileForSemina(MultipartFile[] vodFiles, Map<String, Object> paramMap) throws Exception {
		// vod 존재시 먼저 삭제
		Map<String, Object> semina = commonDao.selectMap("sysSemina.selectSemina", paramMap);
		if(CommonUtil.isEmpty(semina)) return;

		if (!CommonUtil.isEmpty(semina.get("vodFileSeq"))) {
			semina.put("fileSeq", semina.get("vodFileSeq"));
			semina.put("fileDetailSn", "1");
			fileService.fileDelete(semina);
		}
		
        fileService.fileRegist(vodFiles, paramMap, "vod");
        paramMap.put("vodFileSeq",  paramMap.get("fileSeq"));
        commonDao.update("sysSemina.updateSemina", paramMap);
    }

    public boolean updateSemina(Map<String, Object> paramMap) throws Exception {
        List<String> requiredList = Arrays.asList(
                "seminaKndCode",    //세미나종류코드
                "useLangCd",        //세미나언어코드
                "seminaNm",			//세미나명
                "progrsUserSeq",	//진행이용자일련
                "seminaStyleSe",    //세미나 스타일
                "seminaDe",			//세미나일자
                "startHour",        //세미나 시작 시간
                "startMinute",      //세미나 시작 분
                "endHour",			//세미나 종료 시간
                "endMinute",		//세미나 종료 분
                "seminaPlaceNm",	//세미나장소명
                "startPeriodDt",	//모집기간 시작일자
                "startPeriodHour",	//모집기간 시작시간
                "startPeriodMinute",//모집기간 시작분
                "endPeriodDt",      //모집기간 종료일자
                "endPeriodHour",	//모집기간 종료시간
                "endPeriodMinute",  //모집기간 종료분
                "atnlcAuthorArray",	//수강권한배열 -> 회원 종류 -> length로 카운팅
                "atnlcCo",			//수강수
                "seminaImageCn",	//세미나이미지내용
                "seminaDc",			//세미나 개요
                "seminaCn",			//세미나 상세설명
                "seminaKeywordArray"//검색 키워드 -> length로 카운팅
        );
        if (!CommonUtil.validation(paramMap, requiredList)) {
            return false;
        }

        update("sysSemina.updateSemina", paramMap);
        update("sysSemina.updateSeminaKwrd", paramMap);
        return true;
    }

    public void update(String sqlId, Map<String, Object> paramMap) throws Exception {
        if(sqlId.equals("sysSemina.updateSemina")) {
            Map<String, Object> parsedMap = parseMapBetweenFrontAndDbForSeminaTable(paramMap);
            commonDao.update(sqlId, parsedMap);
        } else if(sqlId.equals("sysSemina.updateSeminaKwrd")) {
            Map<String, Object> parsedMap = parseMapBetweenFrontAndDbForSeminaKwrdTable(paramMap);
            commonDao.update(sqlId, parsedMap);
        }
    }

    public void deleteSemina(Map<String, Object> paramMap) throws Exception {
        commonDao.delete("sysSemina.deleteSeminaKwrd", paramMap);
        commonDao.delete("sysSemina.deleteSemina", paramMap);
    }
}
