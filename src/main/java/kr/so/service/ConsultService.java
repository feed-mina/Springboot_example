package kr.so.service;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.web.multipart.MultipartFile;

import kr.so.dao.CommonDao;
import kr.so.mvc.service.CommonService;
import kr.so.util.CamelHashMap;
import kr.so.util.CommonUtil;

@Service
public class ConsultService {

	private Logger log = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private CommonDao commonDao;

	@Autowired
	CommonService commonService;

	@Autowired
	FileService fileService;

	@Autowired
	ImageService imageService;

	public void insertCnslt(Map<String, Object> paramMap) {
		commonService.insert("Consult.insertcnslt", paramMap);

		List<Map<String, Object>> cnsltList = (List<Map<String, Object>>) paramMap.get("cnsltList");
		Map<String, Object> resultMap = new CamelHashMap();

		cnsltList.forEach(x -> {
			resultMap.put("cnsltSeq", paramMap.get("cnsltSeq"));
			resultMap.put("cnsltSn", x.get("cnsltSn"));
			resultMap.put("cnsltDt", x.get("cnsltDt"));
			resultMap.put("cnsltBeginTime", x.get("cnsltBeginTime"));
			resultMap.put("cnsltEndTime", x.get("cnsltEndTime"));
			commonService.insert("Consult.insertcnsltFx", resultMap);
		});
	}

	public void updateCnslt(Map<String, Object> paramMap) {
		commonService.insert("Consult.updateCnslt", paramMap);

		if (!CommonUtil.isEmpty(paramMap.get("cnsltSeq"))) {
			// 먼저 자식 테이블(tb_cnslt_reqst)에서 해당 cnsltSeq를 참조하는 행을 삭제합니다.
			commonService.delete("Consult.deleteCnsltOneFx", paramMap);
		}
		List<Map<String, Object>> cnsltList = (List<Map<String, Object>>) paramMap.get("cnsltList");
		Map<String, Object> resultMap = new CamelHashMap();
		cnsltList.forEach(x -> {
			resultMap.put("cnsltSeq", paramMap.get("cnsltSeq"));
			resultMap.put("cnsltSn", x.get("cnsltSn"));
			resultMap.put("cnsltDt", x.get("cnsltDt"));
			resultMap.put("cnsltBeginTime", x.get("cnsltBeginTime"));
			resultMap.put("cnsltEndTime", x.get("cnsltEndTime"));
			commonService.insert("Consult.insertcnsltFx", resultMap);
		});

	}

	public List<Map<String, Object>> cnsltSeqList(Map<String, Object> paramMap) throws Exception {
		if (ObjectUtils.isEmpty(paramMap.get("cnsltSeq"))) {
			return null;
		}
		// get
		return commonDao.selectList("Consult.selectConsultDetail", paramMap);
	}

	public Map<String, Object> selectConsultDetail(String sqlId, Map<String, Object> paramMap) {
		return commonDao.selectMap(sqlId, paramMap);
	}

	public int deleteCnsltOne(Map<String, Object> paramMap) throws Exception {
		if (delete("Consult.deleteCnsltOneFx", paramMap) < 0) {
			return -1;
		}

		if (delete("Consult.deleteCnsltOne", paramMap) < 0) {
			return -1;
		}

		return 1;
	}

	public int delete(String sqlId, Map<String, Object> paramMap) throws Exception {
		if (sqlId.equals("Consult.deleteCnsltOneFx")) {
			return commonDao.delete(sqlId, paramMap);
		} else if (sqlId.equals("Consult.deleteCnsltOne")) {
			return commonDao.delete(sqlId, paramMap);
		}
		return 0;
	}

	public Map<String, Object> selectCnslt(String sqlId, Map<String, Object> paramMap) {
		return (Map) commonDao.selectOne(sqlId, paramMap);
	}

	public void consultOperateCancel(Map<String, Object> paramMap, MultipartFile[] cnsltFiles) {
		// TODO Auto-generated method stub

	}

	public void upsertBanner(Map<String, Object> paramMap, MultipartFile[] cnsltFiles) throws Exception {
		fileService.bannerFileRegist(cnsltFiles, paramMap);
		return;
	}

	public void updateCnsltOnAirAt(Map<String, Object> paramMap) {

		if (!CommonUtil.isEmpty(paramMap.get("cnsltSeq"))) {
			commonService.insert("Consult.updateCnsltOnAirAt", paramMap);
		}

	}

}
