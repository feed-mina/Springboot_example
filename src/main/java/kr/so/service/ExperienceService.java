package kr.so.service;

import java.util.ArrayList;
import java.util.Arrays;
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
public class ExperienceService {

	private Logger log = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private CommonDao commonDao;

	@Autowired
	CommonService commonService;

	@Autowired
	FileService fileService;

	public void updateGongjarueModalList(Map<String, Object> paramMap) {
		// 데이터 타입 확인
		Object modalListObject = paramMap.get("modalList");
		// 형 변환을 안전하게 수행하기 위해 instanceof를 사용
		if (modalListObject instanceof List<?>) {
			List<Map<String, Object>> modalList = (List<Map<String, Object>>) modalListObject;
			Map<String, Object> resultMap = new CamelHashMap();
			modalList.forEach(x -> {
				resultMap.put("gongjarueSeq", x.get("gongjarueSeq"));
				resultMap.put("gongjarueSj", x.get("gongjarueSj"));
				resultMap.put("gongjarueCn", x.get("gongjarueCn"));
				commonService.update("Experience.updateGongjarueModal", resultMap);
			});
		} else {
			// modalList가 List가 아닌 경우에 대한 처리
			// 예외를 던지거나 로깅 등을 수행할 수 있음
		}
	}

	public void updateGongjarueImgList(MultipartFile[] uploadFile, Map<String, Object> paramMap) throws Exception {
		// 형 변환을 안전하게 수행하기 위해 instanceof를 사용
		if (!ObjectUtils.isEmpty(uploadFile)) {
			paramMap.put("fileSeq", paramMap.get("imageFileSeq"));
			fileService.fileDeleteAll(paramMap);
		}
		// 데이터 타입 확인
		Object imgListObject = paramMap.get("imgList");
		if (imgListObject instanceof List<?>) {
			List<Map<String, Object>> imgList = (List<Map<String, Object>>) imgListObject;
			Map<String, Object> resultMap = new CamelHashMap();
			imgList.forEach(x -> {
				resultMap.put("gongjarueSeq", x.get("gongjarueSeq"));
				resultMap.put("fileSeq", x.get("imageFileSeq"));
				commonService.update("Experience.updateGongjarueImg", resultMap);
			});
		} else {
			//  List가 아닌 경우에 대한 처리
			// 예외를 던지거나 로깅 등을 수행할 수 있음
		}
		// 파일이 첨부되었을경우 모든 파일 삭제 처리
	}

	/*
	 * public void updateGongjarueImgList(MultipartFile[] uploadFile, Map<String,
	 * Object> paramMap) throws Exception {
	 * // 파일이 첨부되었을경우 모든 파일 삭제 처리
	 * 
	 * if (!ObjectUtils.isEmpty(uploadFile)) {
	 * paramMap.put("fileSeq", paramMap.get("imageFileSeq"));
	 * fileService.fileDeleteAll(paramMap);
	 * }
	 * 
	 * List<Map<String, Object>> gongjarueSeq = (List<Map<String, Object>>)
	 * paramMap.get("gongjarueSeq");
	 * Map<String, Object> resultMap = new CamelHashMap();
	 * 
	 * gongjarueSeq.forEach(x -> {
	 * resultMap.put("gongjarueSeq", x.get("gongjarueSeq"));
	 * resultMap.put("fileSeq", x.get("imageFileSeq"));
	 * try {
	 * fileService.fileRegist(uploadFile, paramMap);
	 * commonService.update("Experience.updateGongjarueImg", paramMap);
	 * } catch (Exception e) {
	 * e.printStackTrace();
	 * }
	 * 
	 * });
	 * }
	 */
	/*
	 * public void updateGongjarueImgList(MultipartFile[] uploadFile, Map<String,
	 * Object> paramMap) throws Exception{
	 * // 파일이 첨부되었을경우 모든 파일 삭제 처리
	 * 
	 * 
	 * Map<String, Object> map =
	 * commonService.selectMap("Experience.selectGongjarueList", paramMap);
	 * if (!ObjectUtils.isEmpty(uploadFile)) {
	 * // tb_file_detail 삭제
	 * paramMap.put("fileSeq", paramMap.get("imageFileSeq"));
	 * fileService.fileDeleteAll(paramMap);
	 * // tb_file_mastr 삭제
	 * paramMap.put("delFileSeq", map.get("imageFileSeq"));
	 * commonService.delete("file.deleteFileMastr", paramMap);
	 * System.out.println("gogo");
	 * }
	 * 
	 * 
	 * if (!ObjectUtils.isEmpty(uploadFile)) {
	 * paramMap.put("fileSeq", paramMap.get("imageFileSeq"));
	 * fileService.fileDeleteAll(paramMap);
	 * }
	 * 
	 * List<Map<String, Object>> gongjarueSeq = (List<Map<String,Object>>)
	 * paramMap.get("gongjarueSeq");
	 * Map<String,Object> resultMap = new CamelHashMap();
	 * 
	 * gongjarueSeq.forEach(x ->{
	 * resultMap.put("gongjarueSeq",paramMap.get("gongjarueSeq"));
	 * resultMap.put("fileSeq",paramMap.get("imageFileSeq"));
	 * try {
	 * fileService.fileRegist(uploadFile, paramMap);
	 * commonService.update("Experience.updateGongjarueImg", paramMap);
	 * } catch (Exception e) {
	 * e.printStackTrace();
	 * }
	 * 
	 * });
	 * }
	 */
	public void updateGongjarueImg(MultipartFile[] uploadFile, Map<String, Object> paramMap) throws Exception {
		// 파일이 첨부되었을경우 모든 파일 삭제 처리
		if (!ObjectUtils.isEmpty(uploadFile)) {
			paramMap.put("fileSeq", paramMap.get("imageFileSeq"));
			fileService.fileDeleteAll(paramMap);
		}

		fileService.fileRegist(uploadFile, paramMap);
		commonService.update("Experience.updateGongjarueImg", paramMap);
	}

	public void updateGongjarueList(Map<String, Object> paramMap) {

		commonService.update("Experience.updateGongjarueModal", paramMap);

	}

	public Map<String, Object> parseMapBetweenFrontAndDbForTable(Map<String, Object> paramMap) {
		ArrayList<String> gongjarueNum = (ArrayList<String>) paramMap.get("gongjarueNum");
		int detailGongjarueCo = gongjarueNum.size();
		paramMap.put("detailGongjarueCo", detailGongjarueCo);
		return paramMap;
	}

	public void insertExprn(Map<String, Object> paramMap) {
		commonService.insert("Experience.insertexprn", paramMap);

		List<Map<String, Object>> exprnList = (List<Map<String, Object>>) paramMap.get("exprnList");
		Map<String, Object> resultMap = new CamelHashMap();

		exprnList.forEach(x -> {
			resultMap.put("exprnSeq", paramMap.get("exprnSeq"));
			resultMap.put("exprnSn", x.get("exprnSn"));
			resultMap.put("exprnDt", x.get("exprnDt"));
			resultMap.put("exprnBeginTime", x.get("exprnBeginTime"));
			resultMap.put("exprnEndTime", x.get("exprnEndTime"));
			commonService.insert("Experience.insertexprnFx", resultMap);
		});

	}

	public void updateExprnAttender(Map<String, Object> paramMap) {
		commonService.insert("Experience.updateExprnAttender", paramMap);
	}

	public Map<String, Object> selectExprn(String sqlId, Map<String, Object> paramMap) {
		return (Map) commonDao.selectOne(sqlId, paramMap);
	}

	public Map<String, Object> selectExperienceDetail(String sqlId, Map<String, Object> paramMap) {
		return commonDao.selectMap(sqlId, paramMap);
	}

	public int delete(String sqlId, Map<String, Object> paramMap) throws Exception {
		if (sqlId.equals("Experience.deleteExprnOneFx")) {
			return commonDao.delete(sqlId, paramMap);
		} else if (sqlId.equals("Experience.deleteExprnOne")) {
			return commonDao.delete(sqlId, paramMap);
		}
		return 0;
	}

	public int deleteExprnOne(Map<String, Object> paramMap) throws Exception {
		if (delete("Experience.deleteExprnOneFx", paramMap) < 0) {
			return -1;
		}
		if (delete("Experience.deleteExprnOne", paramMap) < 0) {
			return -1;
		}
		return 1;
	}

	public void insertOtherProposal(Map<String, Object> paramMap) {
		// TODO Auto-generated method stub

	}

	public void updateExprn(Map<String, Object> paramMap) {
		commonService.insert("Experience.updateExprn", paramMap);

		if (!CommonUtil.isEmpty(paramMap.get("exprnSeq"))) {
			commonService.delete("Experience.deleteExprnOneFx", paramMap);
		}
		List<Map<String, Object>> exprnList = (List<Map<String, Object>>) paramMap.get("exprnList");
		Map<String, Object> resultMap = new CamelHashMap();
		exprnList.forEach(x -> {
			resultMap.put("exprnSeq", paramMap.get("exprnSeq"));
			resultMap.put("exprnSn", x.get("exprnSn"));
			resultMap.put("exprnDt", x.get("exprnDt"));
			resultMap.put("exprnBeginTime", x.get("exprnBeginTime"));
			resultMap.put("exprnEndTime", x.get("exprnEndTime"));
			commonService.insert("Experience.insertexprnFx", resultMap);
		});

	}

	public Map<String, Object> getExprnProposal(String sqlId, Map<String, Object> paramMap) {
		return commonDao.selectMap(sqlId, paramMap);
	}

	public void deleteExcrt(Map<String, Object> paramMap) throws Exception {
		Map<String, Object> map = commonService.selectMap("Experience.selectExtfcDetail", paramMap);

		// tb_file_detail 삭제
		map.put("fileSeq", map.get("imageFileSeq"));
		fileService.fileDeleteAll(map);

		// tb_exprn_crtfc 삭제
		commonService.delete("Experience.deleteExcrt", paramMap);

		// tb_file_mastr 삭제
		paramMap.put("delFileSeq", map.get("imageFileSeq"));
		commonService.delete("file.deleteFileMastr", paramMap);
	}

	public void updateExcrt(MultipartFile[] uploadFile, Map<String, Object> paramMap) throws Exception {
		// 파일이 첨부되었을경우 모든 파일 삭제 처리
		if (!ObjectUtils.isEmpty(uploadFile)) {
			paramMap.put("fileSeq", paramMap.get("imageFileSeq"));
			fileService.fileDeleteAll(paramMap);
		}
 

		fileService.fileRegist(uploadFile, paramMap);
		commonService.update("Experience.updateExcrt", paramMap);
	}

}
