package kr.so.service;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import kr.so.dao.CommonDao;

@Service("imageService")
public class ImageService {

	private Logger log = LoggerFactory.getLogger(this.getClass());

	@Autowired
	private CommonDao commonDao;

	public boolean imageRegist(Map<String, Object> paramMap) throws Exception {

		// imageCn 이 단건으로 오는 경우도 처리
		if (ObjectUtils.isEmpty(paramMap.get("imageList")) && ObjectUtils.isEmpty(paramMap.get("imageCn"))) {
			return false;
		}

		// 신규/수정 구분
		if (ObjectUtils.isEmpty(paramMap.get("imageId"))) {
			commonDao.insert("image.insertImageMastr", paramMap);
		} else {
			// 삭제후 재등록
			commonDao.delete("image.deleteImageDetail", paramMap);
		}

		// imageCn 이 단건으로 오는 경우
		if (!ObjectUtils.isEmpty(paramMap.get("imageCn"))) {
			commonDao.insert("image.insertImageDetail", paramMap);
		} else {
			for (Map<String, Object> imageMap : (List<Map<String, Object>>) paramMap.get("imageList")) {
				imageMap.put("imageId", paramMap.get("imageId"));
				commonDao.insert("image.insertImageDetail", imageMap);
			}
		}

		return true;
	}

	public boolean imageDelete(Map<String, Object> paramMap) throws Exception {

		if (ObjectUtils.isEmpty(paramMap.get("imageId"))) {
			return false;
		}

		// detail 삭제
		commonDao.delete("image.deleteImageDetail", paramMap);

		return true;
	}

	public List<Map<String, Object>> imageList(Map<String, Object> paramMap) throws Exception {

		if (ObjectUtils.isEmpty(paramMap.get("imageId"))) {
			return null;
		}

		// get imageList
		return commonDao.selectList("image.selectImageDetail", paramMap);
	}

	// imageCn 이 단건인 경우
	public Map<String, Object> imageMap(Map<String, Object> paramMap) throws Exception {

		if (ObjectUtils.isEmpty(paramMap.get("imageId"))) {
			return null;
		}

		// get imageMap
		return commonDao.selectMap("image.selectImageDetail", paramMap);
	}

}
