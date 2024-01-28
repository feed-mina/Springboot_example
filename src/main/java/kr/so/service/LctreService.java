package kr.so.service;

import kr.so.dao.CommonDao;
import kr.so.mvc.service.CommonService;
import kr.so.util.CommonUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@Service
public class LctreService {

    @Autowired
    private CommonDao commonDao;

    @Autowired
    private FileService fileService;

    @Autowired
    CommonService commonService;

    public int insertLctre(Map<String, Object> paramMap) throws Exception {
        List<String> requiredList = Arrays.asList(
                "startHour",            //강의 시작 시간
                "startMinute",            //강의 시작 분
                "endHour",                //강의 종료 시간
                "endMinute",            //강의 종료 분
                "startDt",                //강의 기간 시작일자
                "endDt",                //강의 기간 종료일자
                "startPeriodDt",        //모집기간 시작일자
                "endPeriodDt",            //모집기간 종료일자
                "startPeriodHour",        //모집기간 시작시간
                "startPeriodMinute",    //모집기간 시작분
                "endPeriodHour",        //모집기간 종료시간
                "endPeriodMinute",        //모집기간 종료분
                "lctreKndCode",            //강의 종류
                "useLangCd",            //사용 언어
                "lctreName",            //강의명
                "profsrUserSeq",        //교수이용자일련
                "lctreNum",                //전체 강좌 수 -> length로 카운팅
                "lctreDayArray",        //강의요일
                "userKndCodeArray",        //회원 종류
                "studentCount",            //수강생 수
                "lctreDetailSubjectArray",    //강좌 디테일 제목 배열
                "lctreDetailOutlineArray",    //강좌 디테일 개요 배열
                "lctreKeywordArray"            //검색 키워드
        );
        if (!CommonUtil.validation(paramMap, requiredList)) {
            return -1;
        }

        if (insert("sysLctre.insertLctre", paramMap) < 0) {
            return -1;
        }
        if (insert("sysLctre.insertLctreFx", paramMap) < 0) {
            return -1;
        }
        if (insert("sysLctre.insertLctreKwrd", paramMap) < 0) {
            return -1;
        }
        return 1;
    }

    public int insert(String sqlId, Map<String, Object> paramMap) throws Exception {
        if (sqlId.equals("sysLctre.insertLctre")) {
            Map<String, Object> parsedMap = parseMapBetweenFrontAndDbForLctreTable(paramMap);
            return commonDao.insert(sqlId, parsedMap);
        } else if (sqlId.equals("sysLctre.insertLctreFx")) {
            for (int i = 0; i < Integer.parseInt(paramMap.get("detailLctreCo").toString()); i++) {
                paramMap.put("lctreSn", i + 1);

                ArrayList<String> subjectList = (ArrayList<String>) paramMap.get("lctreDetailSubjectArray");
                paramMap.put("currentSubject", subjectList.get(i));

                ArrayList<String> outlineList = (ArrayList<String>) paramMap.get("lctreDetailOutlineArray");
                paramMap.put("currentOutline", outlineList.get(i));

                ArrayList<String> lctrePlanList = (ArrayList<String>) paramMap.get("lctreCountArray");
                paramMap.put("currentLctreDate", lctrePlanList.get(i).replaceAll("-", ""));

                paramMap.put("lctreSuple", "N");
                commonDao.insert(sqlId, paramMap);
            }
            return Integer.parseInt(paramMap.get("detailLctreCo").toString());
        } else if (sqlId.equals("sysLctre.insertLctreKwrd")) {
            Map<String, Object> parsedMap = parseMapBetweenFrontAndDbForLctreKwrdTable(paramMap);
            return commonDao.insert(sqlId, parsedMap);
        }
        return 0;
    }

    public Map<String, Object> selectLctre(String sqlId, Map<String, Object> paramMap) {
        return (Map) commonDao.selectOne(sqlId, paramMap);
    }

    public void deleteLctre(Map<String, Object> paramMap) throws Exception {
        delete("sysLctre.deleteLctreKwrd", paramMap);
        delete("sysLctre.deleteLctreFx", paramMap);
        delete("sysLctre.deleteLctre", paramMap);
    }

    public void delete(String sqlId, Map<String, Object> paramMap) throws Exception {
        if (sqlId.equals("sysLctre.deleteLctreKwrd")) {
            commonDao.delete(sqlId, paramMap);
        } else if (sqlId.equals("sysLctre.deleteLctreFx")) {
            commonDao.delete(sqlId, paramMap);
        } else if (sqlId.equals("sysLctre.deleteLctre")) {
            commonDao.delete(sqlId, paramMap);
        }
    }

    public void updateLctreAndLctreFxAndLctreKwrd(Map<String, Object> paramMap) throws Exception {
        update("sysLctre.updateLctreKwrd", paramMap);
        update("sysLctre.updateLctreFx", paramMap);
        update("sysLctre.updateLctre", paramMap);
    }

    public void update(String sqlId, Map<String, Object> paramMap) throws Exception {
        if (sqlId.equals("sysLctre.updateLctreKwrd")) {
            Map<String, Object> parsedMap = parseMapBetweenFrontAndDbForLctreKwrdTable(paramMap);
            commonDao.update(sqlId, parsedMap);
        } else if (sqlId.equals("sysLctre.updateLctreFx")) {
            int originDetailLctreCo = (int) paramMap.get("originDetailLctreCo");
            int detailLctreCo = (int) paramMap.get("detailLctreCo");
            int addedLctreCo = detailLctreCo - originDetailLctreCo;
            for (int i = 0; i < Integer.parseInt(paramMap.get("originDetailLctreCo").toString()); i++) {
                paramMap.put("lctreSn", i + 1);

                ArrayList<String> subjectList = (ArrayList<String>) paramMap.get("lctreDetailSubjectArray");
                paramMap.put("currentSubject", subjectList.get(i));

                ArrayList<String> outlineList = (ArrayList<String>) paramMap.get("lctreDetailOutlineArray");
                paramMap.put("currentOutline", outlineList.get(i));

                ArrayList<String> lctrePlanList = (ArrayList<String>) paramMap.get("lctreCountArray");
                paramMap.put("currentLctreDate", lctrePlanList.get(i).replaceAll("-", ""));

                ArrayList<String> lctreBeginHourList = (ArrayList<String>) paramMap.get("lctreBeginHourArr");
                paramMap.put("currentBeginHour", lctreBeginHourList.get(i));

                ArrayList<String> lctreBeginMinuteList = (ArrayList<String>) paramMap.get("lctreBeginMinuteArr");
                paramMap.put("currentBeginMinute", lctreBeginMinuteList.get(i));

                ArrayList<String> lctreEndHourList = (ArrayList<String>) paramMap.get("lctreEndHourArr");
                paramMap.put("currentEndHour", lctreEndHourList.get(i));

                ArrayList<String> lctreEndMinuteList = (ArrayList<String>) paramMap.get("lctreEndMinuteArr");
                paramMap.put("currentEndMinute", lctreEndMinuteList.get(i));

                commonDao.update(sqlId, paramMap);
            }
            for (int i = 0; i < addedLctreCo; i++) {
                paramMap.put("lctreSn", (originDetailLctreCo + i + 1));

                ArrayList<String> subjectList = (ArrayList<String>) paramMap.get("lctreDetailSubjectArray");
                paramMap.put("currentSubject", subjectList.get(originDetailLctreCo + i));

                ArrayList<String> outlineList = (ArrayList<String>) paramMap.get("lctreDetailOutlineArray");
                paramMap.put("currentOutline", outlineList.get(originDetailLctreCo + i));

                ArrayList<String> lctrePlanList = (ArrayList<String>) paramMap.get("lctreCountArray");
                paramMap.put("currentLctreDate", lctrePlanList.get(originDetailLctreCo + i).replaceAll("-", ""));

                ArrayList<String> lctreBeginHourList = (ArrayList<String>) paramMap.get("lctreBeginHourArr");
                paramMap.put("startHour", lctreBeginHourList.get(originDetailLctreCo + i));

                ArrayList<String> lctreBeginMinuteList = (ArrayList<String>) paramMap.get("lctreBeginMinuteArr");
                paramMap.put("startMinute", lctreBeginMinuteList.get(originDetailLctreCo + i));

                ArrayList<String> lctreEndHourList = (ArrayList<String>) paramMap.get("lctreEndHourArr");
                paramMap.put("endHour", lctreEndHourList.get(originDetailLctreCo + i));

                ArrayList<String> lctreEndMinuteList = (ArrayList<String>) paramMap.get("lctreEndMinuteArr");
                paramMap.put("endMinute", lctreEndMinuteList.get(originDetailLctreCo + i));

                paramMap.put("lctreSuple", "Y");

                commonDao.insert("sysLctre.insertLctreFx", paramMap);
            }
        } else if (sqlId.equals("sysLctre.updateLctre")) {
            Map<String, Object> parsedMap = parseMapBetweenFrontAndDbForLctreTable(paramMap);
            commonDao.update(sqlId, parsedMap);
        }
    }

    public Map<String, Object> parseMapBetweenFrontAndDbForLctreTable(Map<String, Object> paramMap) {
        ArrayList<String> lctreNumList = (ArrayList<String>) paramMap.get("lctreNum");
        int detailLctreCo = lctreNumList.size();
        paramMap.put("detailLctreCo", detailLctreCo);

        ArrayList<String> lctreDayList = (ArrayList<String>) paramMap.get("lctreDayArray");
        String lctreDayStr = String.join(",", lctreDayList);
        paramMap.put("lctreDayStr", lctreDayStr);

        ArrayList<String> userKndCodeList = (ArrayList<String>) paramMap.get("userKndCodeArray");
        String userKndCodeStr = String.join(",", userKndCodeList);
        paramMap.put("userKndCodeStr", userKndCodeStr);

        String startDtStr = paramMap.get("startDt").toString().replaceAll("-", "");
        paramMap.put("startDtStr", startDtStr);

        String endDtStr = paramMap.get("endDt").toString().replaceAll("-", "");
        paramMap.put("endDtStr", endDtStr);

        String startPeriodDtStr = paramMap.get("startPeriodDt").toString().replaceAll("-", "");
        paramMap.put("startPeriodDtStr", startPeriodDtStr);

        String endPeriodDtStr = paramMap.get("endPeriodDt").toString().replaceAll("-", "");
        paramMap.put("endPeriodDtStr", endPeriodDtStr);
        return paramMap;
    }

    public Map<String, Object> parseMapBetweenFrontAndDbForLctreKwrdTable(Map<String, Object> paramMap) {
        ArrayList<String> lctreKeywordList = (ArrayList<String>) paramMap.get("lctreKeywordArray");
        String lctreKeywordStr = String.join("&", lctreKeywordList);
        paramMap.put("lctreKeywordStr", lctreKeywordStr);
        return paramMap;
    }

    public void insertVodFileForLctreFx(MultipartFile[] vodFiles, Map<String, Object> paramMap) throws Exception {

        // vod 존재시 먼저 삭제
        Map<String, Object> lctre = commonDao.selectMap("sysLctre.selectLctreFx", paramMap);
		if(CommonUtil.isEmpty(lctre)) return;

        if (!CommonUtil.isEmpty(lctre.get("vodFileSeq"))) {
            lctre.put("fileSeq", lctre.get("vodFileSeq"));
            lctre.put("fileDetailSn", "1");
            fileService.fileDelete(lctre);
        }

        fileService.fileRegist(vodFiles, paramMap, "vod");
        paramMap.put("vodFileSeq", paramMap.get("fileSeq"));
        commonDao.update("sysLctre.updateLctreFx", paramMap);
    }

    public List<Map<String, Object>> selectUserPlanList(Map<String, Object> paramMap) throws Exception {
        List<Map<String, Object>> resultList = new ArrayList<>();

        if (paramMap.get("user") != null) {
            Map userMap = (Map) paramMap.get("user");
            if (userMap.get("userAuthor").toString().equals("PR")) {
                paramMap.put("profsrSeqInclude", "true");
            }
        }

        if (paramMap.get("firstCategoryCode") != null) {
            String firstCategoryCode = paramMap.get("firstCategoryCode").toString();
            switch (firstCategoryCode) {
                case "LCTRE_KND_CODE":
                    List<Map<String, Object>> lctreMaps = getLctreMapsForPlanList(paramMap);
                    resultList.addAll(lctreMaps);
                    break;
                case "SEMINA_KND_CODE":
                    List<Map<String, Object>> seminaMaps = getSeminaMapsForPlanList(paramMap);
                    resultList.addAll(seminaMaps);
                    break;
                case "CNSLT_KND_CODE":
                    List<Map<String, Object>> cnsltMaps = getCnsltMapsForPlanList(paramMap);
                    resultList.addAll(cnsltMaps);
                    break;
                case "EXPRN_KND_CODE":
                    List<Map<String, Object>> exprnMaps = getExprnMapsForPlanList(paramMap);
                    resultList.addAll(exprnMaps);
                    break;
            }
            return resultList;
        }

        List<Map<String, Object>> lctreMaps = getLctreMapsForPlanList(paramMap);
        List<Map<String, Object>> seminaMaps = getSeminaMapsForPlanList(paramMap);
        List<Map<String, Object>> cnsltMaps = getCnsltMapsForPlanList(paramMap);
        List<Map<String, Object>> exprnMaps = new ArrayList<>();

        resultList.addAll(lctreMaps);
        resultList.addAll(seminaMaps);
        resultList.addAll(cnsltMaps);

        if (paramMap.get("user") != null) {
            Map userMap = (Map) paramMap.get("user");
            if (userMap.get("userAuthor").toString().equals("SA")) {
                exprnMaps = getExprnMapsForPlanList(paramMap);
                resultList.addAll(exprnMaps);
            }
        }
        return resultList;
    }

    private List<Map<String, Object>> getCnsltMapsForPlanList(Map<String, Object> paramMap) {
        List<Map<String, Object>> cnsltMaps = commonService.selectList("Consult.sql_cnsltOperateListForPlan", paramMap);
        cnsltMaps.forEach((el) -> {
            Map<String, Object> element = new HashMap<>();
            element.put("division", "cnslt");
            element.put("cnsltSeq", el.get("cnsltSeq"));
            element.put("cnsltSn", el.get("cnsltSn"));
            element.put("cnsltKndCode", el.get("cnsltKndCode"));
            el.remove("cnsltSeq");
            el.remove("cnsltSn");
            el.remove("cnsltKndCode");
            el.put("extendedProps", element);
            el.put("color", "green");
        });
        return cnsltMaps;
    }

    private List<Map<String, Object>> getSeminaMapsForPlanList(Map<String, Object> paramMap) {
        List<Map<String, Object>> seminaMaps = commonService.selectList("sysSemina.sql_seminaListForPlan", paramMap);
        seminaMaps.forEach((el) -> {
            Map<String, Object> element = new HashMap<>();
            element.put("division", "semina");
            element.put("seminaSeq", el.get("seminaSeq"));
            element.put("useAt", el.get("useAt"));
            element.put("seminaKndCode", el.get("seminaKndCode"));
            el.remove("seminaSeq");
            el.remove("useAt");
            el.remove("seminaKndCode");
            el.put("extendedProps", element);
            el.put("color", "red");
        });
        return seminaMaps;
    }

    private List<Map<String, Object>> getLctreMapsForPlanList(Map<String, Object> paramMap) {
        List<Map<String, Object>> lctreMaps = commonService.selectList("sysLctre.sql_lctreOperateListForPlan", paramMap);
        lctreMaps.forEach((el) -> {
            Map<String, Object> element = new HashMap<>();
            element.put("division", "lctre");
            element.put("lctreSeq", el.get("lctreSeq"));
            element.put("lctreSn", el.get("lctreSn"));
            element.put("useAt", el.get("useAt"));
            element.put("lctreKndCode", el.get("lctreKndCode"));
            el.remove("lctreSeq");
            el.remove("lctreSn");
            el.remove("useAt");
            el.remove("lctreKndCode");
            el.put("extendedProps", element);
            el.put("color", "blue");
        });
        return lctreMaps;
    }

    private List<Map<String, Object>> getExprnMapsForPlanList(Map<String, Object> paramMap) {
        List<Map<String, Object>> exprnMaps = commonService.selectList("Experience.sql_exprnOperateListForPlan", paramMap);
        exprnMaps.forEach((el) -> {
            Map<String, Object> element = new HashMap<>();
            element.put("division", "exprn");
            element.put("exprnSeq", el.get("exprnSeq"));
            element.put("exprnSn", el.get("exprnSn"));
            element.put("exprnKndCode", el.get("exprnKndCode"));
            el.remove("exprnSeq");
            el.remove("exprnSn");
            el.remove("exprnKndCode");
            el.put("extendedProps", element);
            el.put("color", "orange");
        });
        return exprnMaps;
    }
}
